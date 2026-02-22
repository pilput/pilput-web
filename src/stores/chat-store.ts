import { create } from "zustand";
import { type Message } from "@/components/chat/chat-message";
import { axiosInstance3 } from "@/utils/fetch";
import { getToken } from "@/utils/Auth";
import { Config } from "@/utils/getConfig";

// Types
export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
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
  data: {
    id: string;
    title: string;
    createdAt: string;
  };
}

/** API response for get conversation endpoint */
interface GetConversationResponse {
  success: boolean;
  data: {
    id: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    title: string;
    user_id: string;
    chatMessages: Array<{
      id: string;
      created_at: string;
      updated_at: string;
      conversation_id: string;
      user_id: string;
      role: "user" | "assistant";
      content: string;
      model: string | null;
      prompt_tokens: number | null;
      completion_tokens: number | null;
      total_tokens: number | null;
    }>;
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

interface ChatState {
  // Data
  messages: Message[];
  conversations: Conversation[];
  selectedModel: string;
  availableModels: { id: string; name: string }[];

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
  fetchMessages: (conversationId: string) => Promise<void>;
  createConversation: (
    title: string,
    message: string,
  ) => Promise<string | null>;
  resetPagination: () => void;
  sendMessage: (content: string, conversationId: string) => Promise<void>;
  deleteConversation: (conversationId: string) => Promise<boolean>;
  setMessages: (messages: Message[]) => void;
  editMessage: (id: string, content: string) => void;
  setSelectedModel: (model: string) => void;
  loadMoreConversations: () => Promise<void>;
  clearError: () => void;
  streamMessage: (
    conversationId: string,
    content: string,
    assistantMessageId: string,
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
    { id: "stepfun/step-3.5-flash:free", name: "StepFun 3.5 Flash" },
    { id: "z-ai/glm-4.5-air:free", name: "GLM 4.5 Air" },
    { id: "tngtech/deepseek-r1t2-chimera:free", name: "DeepSeek R1T2 Chimera" },
    {
      id: "mistralai/mistral-small-3.1-24b-instruct:free",
      name: "Mistral Small 3.1 24B",
    },
  ],
  isLoading: false,
  isNewConversation: false,
  error: null,
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

  // Helper function for streaming messages
  streamMessage: async (
    conversationId: string,
    content: string,
    assistantMessageId: string,
  ) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);
    let updateTimeout: number | null = null;

    try {
      const response = await fetch(
        `${Config.apibaseurl2}/v1/chat/conversations/${conversationId}/messages/stream`,
        {
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
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body reader available");
      }

      let accumulatedContent = "";

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

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();

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
              const parsed = JSON.parse(data);
              if (parsed.content) {
                accumulatedContent += parsed.content;

                if (updateTimeout) {
                  clearTimeout(updateTimeout);
                }
                updateTimeout = window.setTimeout(batchedUpdate, 16);
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
      set({ isNewConversation: false });
    } catch (error) {
      throw error; // Re-throw to be handled by caller
    } finally {
      if (updateTimeout) {
        clearTimeout(updateTimeout);
      }
      clearTimeout(timeoutId);
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

      const response = await axiosInstance3.get<ConversationsResponse>(
        "/v1/chat/conversations",
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
      const error: ChatError = {
        message:
          err?.response?.data?.message || "Failed to fetch conversations",
        code: err?.response?.status?.toString(),
      };
      set((state) => ({
        loadingStates: { ...state.loadingStates, fetchingChats: false },
        error,
      }));

      // Handle authentication errors
      if (err?.response?.status === 401 && typeof window !== "undefined") {
        window.location.href = "/login";
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
  fetchMessages: async (conversationId) => {
    if (!validateConversationId(conversationId)) {
      set({ error: { message: "Invalid conversation ID" } });
      return;
    }

    try {
      set((state) => ({
        loadingStates: { ...state.loadingStates, fetchingMessages: true },
        error: null,
      }));

      const response = await axiosInstance3.get<GetConversationResponse>(
        `/v1/chat/conversations/${conversationId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        },
      );

      const chatMessages = response.data.data.chatMessages ?? [];
      const messages: Message[] = chatMessages.map((msg) => ({
        id: msg.id,
        content: msg.content,
        role: msg.role,
        createdAt: new Date(msg.created_at),
        isStreaming: false,
      }));

      set((state) => ({
        messages,
        loadingStates: { ...state.loadingStates, fetchingMessages: false },
      }));
    } catch (err: any) {
      const error: ChatError = {
        message: err?.response?.data?.message || "Failed to fetch messages",
        code: err?.response?.status?.toString(),
      };
      set((state) => ({
        loadingStates: { ...state.loadingStates, fetchingMessages: false },
        error,
      }));
      console.error("Error fetching messages:", error);
    }
  },
  /**
   * Create a new conversation and return its ID.
   * Navigation and initial message sending are handled by the caller.
   * @param title - Optional conversation title (auto-generated from message if empty)
   * @param message - Initial message content used for title generation
   * @returns Conversation ID or null on failure
   */
  createConversation: async (title, message) => {
    const { isLoading } = get();

    // Input validation
    const messageValidation = validateMessage(message);
    if (!messageValidation.isValid) {
      set({ error: { message: messageValidation.error! } });
      return null;
    }

    if (isLoading) return null;

    set((state) => ({
      loadingStates: { ...state.loadingStates, creatingConversation: true },
      error: null,
    }));
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const sanitizedMessage = sanitizeString(message);
      const conversationTitle = title
        ? sanitizeString(title)
        : sanitizedMessage.slice(0, 50) +
          (sanitizedMessage.length > 50 ? "..." : "");

      const response = await axiosInstance3.post<CreateConversationResponse>(
        "/v1/chat/conversations",
        {
          title: conversationTitle,
          message: sanitizedMessage,
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
      const error: ChatError = {
        message:
          err?.response?.data?.message || "Failed to create conversation",
        code: err?.response?.status?.toString(),
      };
      set((state) => ({
        loadingStates: { ...state.loadingStates, creatingConversation: false },
        error,
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
   * @param conversationId - ID of the conversation
   */
  sendMessage: async (content, conversationId) => {
    const { isLoading, messages, selectedModel } = get();

    // Input validation
    const messageValidation = validateMessage(content);
    if (!messageValidation.isValid) {
      set({ error: { message: messageValidation.error! } });
      return;
    }

    if (!validateConversationId(conversationId)) {
      set({ error: { message: "Invalid conversation ID" } });
      return;
    }

    if (isLoading) return;

    const sanitizedContent = sanitizeString(content);
    const userMessage: Message = {
      id: Date.now().toString(),
      content: sanitizedContent,
      role: "user",
      createdAt: new Date(),
      isStreaming: false,
    };

    // Add user message and create placeholder for assistant response
    const assistantMessage: Message = {
      id: `assistant-${Date.now()}`,
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
      );
    } catch (err: any) {
      const error: ChatError = {
        message: err?.response?.data?.message || "Failed to send message",
        code: err?.response?.status?.toString(),
      };

      console.error("Error sending message:", error);
      set((state) => {
        const filtered = state.messages.filter(
          (msg) => msg.id !== userMessage.id && msg.id !== assistantMessage.id,
        );
        const errorMessage: Message = {
          id: `error-${Date.now()}`,
          content: "Sorry, I encountered an error. Please try again.",
          role: "assistant",
          createdAt: new Date(),
          isStreaming: false,
        };
        return {
          messages: [...filtered, userMessage, errorMessage],
          error,
        };
      });
    } finally {
      set((state) => ({
        loadingStates: { ...state.loadingStates, sendingMessage: false },
      }));
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

      const response = await axiosInstance3.delete(
        `/v1/chat/conversations/${conversationId}`,
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
      const error: ChatError = {
        message:
          err?.response?.data?.message || "Failed to delete conversation",
        code: err?.response?.status?.toString(),
      };
      set((state) => ({
        loadingStates: { ...state.loadingStates, deletingConversation: false },
        error,
      }));
      console.error("Error deleting conversation:", error);
      return false;
    }
  },
}));
