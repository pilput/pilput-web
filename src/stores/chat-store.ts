import { create } from "zustand";
import { type Message } from "@/components/chat/chat-message";
import { apiClient } from "@/utils/fetch";
import { getToken } from "@/utils/Auth";
import { Config } from "@/utils/getConfig";

// Types
export interface Conversation {
  id: string;
  title: string;
  user_id: string;
  is_pinned: boolean;
  pinned_at: string | null;
  message_count: number;
  created_at: string;
  updated_at: string;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  total_items?: number; // Some APIs might use this
}

interface ConversationsResponse {
  data: Conversation[];
  meta: PaginationMeta;
}

interface CreateConversationResponse {
  data: Conversation;
}

export interface ChatMessageResponse {
  id: string;
  conversation_id: string;
  user_id: string;
  role: string;
  content: string;
  model: string | null;
  prompt_tokens: number | null;
  completion_tokens: number | null;
  total_tokens: number | null;
  created_at: string;
  updated_at: string;
}

/** API response for get conversation endpoint */
interface GetConversationResponse {
  data: Conversation & {
    chat_messages: ChatMessageResponse[];
  };
}

interface ChatError {
  message: string;
  code?: string;
}

// Utility functions
const sanitizeString = (str: string): string => {
  return str.trim().replace(/[<>]/g, "");
};

const validateConversationId = (id: string): boolean => {
  return typeof id === "string" && id.trim().length > 0 && id.length <= 100;
};

const validateMessage = (
  message: string,
): { isValid: boolean; error?: string } => {
  const trimmed = message.trim();
  if (!trimmed) {
    return { isValid: false, error: "Message cannot be empty" };
  }
  if (trimmed.length > 10000) {
    return {
      isValid: false,
      error: "Message is too long (max 10000 characters)",
    };
  }
  return { isValid: true };
};

/**
 * Extracts error information from an API error response
 * Returns ChatError with isAuthError flag for 401 responses
 */
const extractError = (err: any, defaultMessage: string): ChatError & { isAuthError?: boolean } => {
  const status = err?.response?.status;
  return {
    message: err?.response?.data?.message || defaultMessage,
    code: status?.toString(),
    isAuthError: status === 401,
  };
};

interface ChatState {
  // Data
  messages: Message[];
  conversations: Conversation[];
  selectedModel: string;
  availableModels: { id: string; name: string }[];
  activeStreamController: AbortController | null;

  // UI State
  isLoading: boolean;
  isNewConversation: boolean;
  error: ChatError | null;
  loadingStates: {
    fetchingChats: boolean;
    fetchingMessages: boolean;
    creatingConversation: boolean;
    sendingMessage: boolean;
    deletingConversation: boolean;
  };

  // Pagination
  conversationsPagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };

  // Actions
  fetchConversations: (page?: number, limit?: number) => Promise<void>;
  fetchMessages: (conversationId: string, signal?: AbortSignal) => Promise<void>;
  resetChat: () => void;
  createConversation: (
    title: string,
    message: string,
  ) => Promise<string | null>;
  resetPagination: () => void;
  sendMessage: (
    content: string,
    conversationId?: string,
    onConversationCreated?: (id: string) => void,
  ) => Promise<void>;
  updateConversation: (
    id: string,
    updates: { title?: string; is_pinned?: boolean },
  ) => Promise<boolean>;
  deleteConversation: (conversationId: string) => Promise<boolean>;
  setMessages: (messages: Message[]) => void;
  editMessage: (id: string, content: string) => void;
  setSelectedModel: (model: string) => void;
  loadMoreConversations: () => Promise<void>;
  clearError: () => void;
  abortActiveStream: () => void;
  streamMessage: (
    conversationId: string | undefined | null,
    content: string,
    assistantMessageId: string,
    onConversationCreated?: (id: string) => void,
  ) => Promise<void>;
}

/**
 * Zustand store for managing chat functionality
 * Handles conversations, messages, streaming, and pagination
 */
export const useChatStore = create<ChatState>((set, get) => ({
  // Initial state
  messages: [],
  conversations: [],
  selectedModel: "openrouter/free",
  availableModels: [
    { id: "openrouter/free", name: "OpenRouter Free" },
    {
      id: "nvidia/nemotron-3-super-120b-a12b:free",
      name: "Nvidia Nemotron-3 Super 120B",
    },
    {
      id: "google/gemma-4-31b-it:free",
      name: "Google Gemma 4 31B IT",
    },
  ],
  isLoading: false,
  isNewConversation: false,
  error: null,
  activeStreamController: null,
  loadingStates: {
    fetchingChats: false,
    fetchingMessages: false,
    creatingConversation: false,
    sendingMessage: false,
    deletingConversation: false,
  },
  conversationsPagination: {
    page: 0,
    limit: 15,
    total: 0,
    hasMore: true,
  },

  // Basic setters
  setMessages: (messages) => set({ messages }),
  setSelectedModel: (model) => set({ selectedModel: model }),
  clearError: () => set({ error: null }),

  streamMessage: async (
    conversationId: string | undefined | null,
    content: string,
    assistantMessageId: string,
    onConversationCreated?: (id: string) => void,
  ) => {
    const controller = new AbortController();
    set({ activeStreamController: controller });
    const timeoutId = setTimeout(() => controller.abort(), 60000);
    let updateTimeout: number | null = null;

    try {
      const url = conversationId
        ? `${Config.apibaseurl}/api/chat/conversations/${conversationId}/messages/stream`
        : `${Config.apibaseurl}/api/chat/conversations/stream`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          content,
          model: get().selectedModel,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body reader available");
      }

      let accumulatedContent = "";
      let buffer = "";
      let currentEvent = "";

      const batchedUpdate = () => {
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: accumulatedContent }
              : msg,
          ),
        }));
      };

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          if (trimmed.startsWith("event: ")) {
            currentEvent = trimmed.slice(7).trim();
            continue;
          }

          if (trimmed.startsWith("data: ")) {
            const data = trimmed.slice(6).trim();

            if (data === "[DONE]") {
              if (updateTimeout) {
                clearTimeout(updateTimeout);
                updateTimeout = null;
              }
              batchedUpdate();
              set((state) => ({
                messages: state.messages.map((msg) =>
                  msg.id === assistantMessageId
                    ? { ...msg, isStreaming: false }
                    : msg,
                ),
              }));
              break;
            }

            try {
              let parsed: any = null;
              try {
                parsed = JSON.parse(data);
              } catch {
                parsed = data; // Keep as string
              }

              // Determine actual event type
              const eventType = currentEvent || (parsed && parsed.type) || "";

              if (eventType === "conversation_created") {
                const id = parsed.conversation_id || (parsed.data && parsed.data.conversation_id);
                if (id) {
                  set({ isNewConversation: true });
                  onConversationCreated?.(id);

                  // Update sidebar conversation list locally for instant UI update
                  const newConv: Conversation = {
                    id,
                    title: content.slice(0, 50) + (content.length > 50 ? "..." : ""),
                    user_id: "",
                    is_pinned: false,
                    pinned_at: null,
                    message_count: 2,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                  };
                  set((state) => ({
                    conversations: [newConv, ...state.conversations],
                  }));
                }
              } else if (eventType === "ai_chunk") {
                const chunkText = typeof parsed === "string" ? parsed : (parsed.data || parsed.content || "");
                if (chunkText) {
                  accumulatedContent += chunkText;
                  if (updateTimeout) {
                    clearTimeout(updateTimeout);
                  }
                  updateTimeout = window.setTimeout(batchedUpdate, 16);
                }
              } else if (eventType === "ai_complete") {
                // Done streaming the message
                const completeMsg = parsed.data || parsed;
                if (completeMsg && completeMsg.content) {
                  accumulatedContent = completeMsg.content;
                  if (updateTimeout) {
                    clearTimeout(updateTimeout);
                  }
                  batchedUpdate();
                }
              } else if (eventType === "error") {
                const errMsg = typeof parsed === "string" ? parsed : (parsed.message || "An error occurred during streaming");
                throw new Error(errMsg);
              } else {
                // Fallback for generic or old style SSE
                const chunkText = typeof parsed === "string"
                  ? parsed
                  : (parsed.type === "ai_chunk" && typeof parsed.data === "string"
                      ? parsed.data
                      : (parsed.content || ""));

                if (chunkText) {
                  accumulatedContent += chunkText;
                  if (updateTimeout) {
                    clearTimeout(updateTimeout);
                  }
                  updateTimeout = window.setTimeout(batchedUpdate, 16);
                }
              }
            } catch (parseError) {
              console.warn("Failed to parse streaming data:", parseError);
            }
          }
        }
      }

      if (updateTimeout) {
        clearTimeout(updateTimeout);
      }
      clearTimeout(timeoutId);
    } catch (error) {
      throw error;
    } finally {
      if (updateTimeout) {
        clearTimeout(updateTimeout);
      }
      clearTimeout(timeoutId);
      set((state) => ({
        isNewConversation: false,
        activeStreamController: state.activeStreamController === controller ? null : state.activeStreamController,
      }));
    }
  },
  editMessage: (id, content) => {
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, content } : msg,
      ),
    }));
  },
  /**
   * Fetch recent conversations with pagination
   * @param page - Page number (0-based)
   * @param limit - Number of conversations per page
   */
  fetchConversations: async (page = 0, limit = 15) => {
    try {
      set((state) => ({
        loadingStates: { ...state.loadingStates, fetchingChats: true },
        error: null,
      }));

      const response = await apiClient.get<ConversationsResponse>(
        "/api/chat/conversations",
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
          params: {
            offset: page * limit,
            limit,
          },
        },
      );

      const { data, meta } = response.data;

      set((state) => {
        const isReset = page === 0;
        const total = meta?.total_items || meta?.total || 0;
        const totalPages = meta?.total_pages || Math.ceil(total / limit);
        const currentPage = page;
        // More robust hasMore calculation: check if we received a full page of data
        const hasMore =
          data.length === limit &&
          (totalPages > currentPage + 1 || total > (currentPage + 1) * limit);

        // Ensure no duplicate conversations by using a Map keyed by conversation.id
        const conversationMap = new Map<string, Conversation>();
        if (!isReset) {
          state.conversations.forEach((conv) =>
            conversationMap.set(conv.id, conv),
          );
        }
        data.forEach((conv) => conversationMap.set(conv.id, conv));
        const uniqueConversations = Array.from(conversationMap.values());

        // If loading more and no new unique items were added, stop pagination
        const hasNewItems =
          uniqueConversations.length > state.conversations.length;
        const effectiveHasMore = isReset ? hasMore : hasMore && hasNewItems;

        return {
          conversations: uniqueConversations,
          conversationsPagination: {
            page: currentPage,
            limit,
            total,
            hasMore: effectiveHasMore,
          },
          loadingStates: { ...state.loadingStates, fetchingChats: false },
        };
      });
    } catch (err: any) {
      const error = extractError(err, "Failed to fetch conversations");
      set((state) => ({
        loadingStates: { ...state.loadingStates, fetchingChats: false },
        error: { message: error.message, code: error.code },
      }));

      // Auth error is returned with isAuthError flag
      // Navigation should be handled by component or auth middleware
      if (error.isAuthError) {
        console.warn("Authentication error - redirect needed");
      }
    }
  },
  loadMoreConversations: async () => {
    const { conversationsPagination, fetchConversations, loadingStates } =
      get();
    if (!conversationsPagination.hasMore || loadingStates.fetchingChats) return;

    const nextPage = conversationsPagination.page + 1;
    await fetchConversations(nextPage, conversationsPagination.limit);
  },
  resetPagination: () => {
    set({
      conversationsPagination: {
        page: 0,
        limit: 15,
        total: 0,
        hasMore: true,
      },
      conversations: [],
    });
  },
  abortActiveStream: () => {
    const { activeStreamController } = get();
    if (activeStreamController) {
      activeStreamController.abort();
    }
    set({ activeStreamController: null });
  },
  resetChat: () => {
    get().abortActiveStream();
    set({
      messages: [],
      isNewConversation: false,
      error: null,
    });
  },
  fetchMessages: async (conversationId, signal) => {
    if (!validateConversationId(conversationId)) {
      set({ error: { message: "Invalid conversation ID" } });
      return;
    }

    try {
      set((state) => ({
        loadingStates: { ...state.loadingStates, fetchingMessages: true },
        error: null,
      }));

      const response = await apiClient.get<GetConversationResponse>(
        `/api/chat/conversations/${conversationId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          signal,
        },
      );

      const chatMessages = response.data.data.chat_messages ?? [];
      const messages: Message[] = chatMessages.map((msg) => ({
        id: msg.id,
        content: msg.content,
        role: msg.role as "user" | "assistant",
        createdAt: new Date(msg.created_at),
        isStreaming: false,
      }));

      set((state) => ({
        messages,
        loadingStates: { ...state.loadingStates, fetchingMessages: false },
      }));
    } catch (err: any) {
      if (err?.name === "AbortError") {
        return;
      }
      const error = extractError(err, "Failed to fetch messages");
      set((state) => ({
        loadingStates: { ...state.loadingStates, fetchingMessages: false },
        error: { message: error.message, code: error.code },
      }));
      console.error("Error fetching messages:", error);
    }
  },
  /**
   * Create a new conversation and return its ID.
   * @param title - Conversation title
   * @returns Conversation ID or null on failure
   */
  createConversation: async (title) => {
    const { isLoading } = get();

    if (isLoading) return null;

    set((state) => ({
      loadingStates: { ...state.loadingStates, creatingConversation: true },
      error: null,
    }));
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const conversationTitle = title ? sanitizeString(title) : "New Chat";

      const response = await apiClient.post<CreateConversationResponse>(
        "/api/chat/conversations",
        {
          title: conversationTitle,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          signal: controller.signal,
        },
      );

      const conversationId = response.data.data.id;

      set({
        isNewConversation: true,
        messages: [],
        conversations: [],
        conversationsPagination: {
          page: 0,
          limit: 15,
          total: 0,
          hasMore: true,
        },
      });

      return conversationId;
    } catch (err: any) {
      const error = extractError(err, "Failed to create conversation");
      set((state) => ({
        loadingStates: { ...state.loadingStates, creatingConversation: false },
        error: { message: error.message, code: error.code },
      }));
      console.error("Error creating conversation:", error);
      return null;
    } finally {
      clearTimeout(timeoutId);
      set((state) => ({
        loadingStates: { ...state.loadingStates, creatingConversation: false },
      }));
    }
  },
  /**
   * Send a message and stream the AI response
   * @param content - Message content to send
   * @param conversationId - Optional ID of the conversation (empty for new conversations)
   * @param onConversationCreated - Optional callback triggered when new conversation is created
   */
  sendMessage: async (content, conversationId, onConversationCreated) => {
    const { isLoading, messages } = get();

    // Input validation
    const messageValidation = validateMessage(content);
    if (!messageValidation.isValid) {
      set({ error: { message: messageValidation.error! } });
      return;
    }

    if (conversationId && !validateConversationId(conversationId)) {
      set({ error: { message: "Invalid conversation ID" } });
      return;
    }

    if (isLoading) return;

    const sanitizedContent = sanitizeString(content);
    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: sanitizedContent,
      role: "user",
      createdAt: new Date(),
      isStreaming: false,
    };

    // Add user message and create placeholder for assistant response
    const assistantMessage: Message = {
      id: `assistant-${crypto.randomUUID()}`,
      content: "",
      role: "assistant",
      createdAt: new Date(),
      isStreaming: true,
    };

    set((state) => ({
      messages: [...messages, userMessage, assistantMessage],
      loadingStates: { ...state.loadingStates, sendingMessage: true },
      error: null,
    }));

    try {
      await get().streamMessage(
        conversationId,
        sanitizedContent,
        assistantMessage.id,
        onConversationCreated,
      );
    } catch (err: any) {
      const error = extractError(err, "Failed to send message");

      console.error("Error sending message:", error);
      set((state) => {
        const filtered = state.messages.filter(
          (msg) => msg.id !== userMessage.id && msg.id !== assistantMessage.id,
        );
        const errorMessage: Message = {
          id: `error-${crypto.randomUUID()}`,
          content: "Sorry, I encountered an error. Please try again.",
          role: "assistant",
          createdAt: new Date(),
          isStreaming: false,
        };
        return {
          messages: [...filtered, userMessage, errorMessage],
          error: { message: error.message, code: error.code },
        };
      });
    } finally {
      set((state) => ({
        loadingStates: { ...state.loadingStates, sendingMessage: false },
      }));
    }
  },
  updateConversation: async (id, updates) => {
    if (!validateConversationId(id)) {
      set({ error: { message: "Invalid conversation ID" } });
      return false;
    }

    try {
      const response = await apiClient.put<CreateConversationResponse>(
        `/api/chat/conversations/${id}`,
        updates,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        },
      );

      if (response.status === 200) {
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === id ? { ...conv, ...response.data.data } : conv
          ),
        }));
        return true;
      }
      return false;
    } catch (err: any) {
      const error = extractError(err, "Failed to update conversation");
      set({ error: { message: error.message, code: error.code } });
      console.error("Error updating conversation:", error);
      return false;
    }
  },
  deleteConversation: async (conversationId) => {
    if (!validateConversationId(conversationId)) {
      set({ error: { message: "Invalid conversation ID" } });
      return false;
    }

    try {
      set((state) => ({
        loadingStates: { ...state.loadingStates, deletingConversation: true },
        error: null,
      }));

      const response = await apiClient.delete(
        `/api/chat/conversations/${conversationId}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        },
      );

      if (response.status === 200) {
        // Remove the conversation from conversations
        set((state) => ({
          conversations: state.conversations.filter(
            (conv) => conv.id !== conversationId,
          ),
          loadingStates: {
            ...state.loadingStates,
            deletingConversation: false,
          },
        }));
        return true;
      }

      // Handle non-200 responses
      set((state) => ({
        loadingStates: { ...state.loadingStates, deletingConversation: false },
        error: { message: "Failed to delete conversation" },
      }));
      return false;
    } catch (err: any) {
      const error = extractError(err, "Failed to delete conversation");
      set((state) => ({
        loadingStates: { ...state.loadingStates, deletingConversation: false },
        error: { message: error.message, code: error.code },
      }));
      console.error("Error deleting conversation:", error);
      return false;
    }
  },
}));

