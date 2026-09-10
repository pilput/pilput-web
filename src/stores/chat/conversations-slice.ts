import type { StateCreator } from "zustand";
import type { Message } from "@/components/chat/chat-message";
import { apiClient } from "@/utils/fetch";
import { getToken } from "@/utils/Auth";
import type {
  ChatState,
  ConversationsResponse,
  CreateConversationResponse,
  GetConversationResponse,
} from "./types";
import {
  extractError,
  isAbortError,
  mergeConversations,
  sanitizeString,
  validateConversationId,
} from "./utils";

export type ConversationsSlice = Pick<
  ChatState,
  | "fetchConversations"
  | "fetchMessages"
  | "createConversation"
  | "updateConversation"
  | "deleteConversation"
  | "loadMoreConversations"
  | "resetPagination"
>;

const CREATE_TIMEOUT_MS = 30000;

export const createConversationsSlice: StateCreator<
  ChatState,
  [],
  [],
  ConversationsSlice
> = (set, get) => ({
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

        const uniqueConversations = mergeConversations(
          state.conversations,
          data,
          isReset,
        );

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
    } catch (err) {
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
    } catch (err) {
      if (isAbortError(err)) {
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
    const timeoutId = setTimeout(() => controller.abort(), CREATE_TIMEOUT_MS);

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
    } catch (err) {
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
            conv.id === id ? { ...conv, ...response.data.data } : conv,
          ),
        }));
        return true;
      }
      return false;
    } catch (err) {
      const error = extractError(err, "Failed to update conversation");
      set((state) => ({
        error: { message: error.message, code: error.code },
      }));
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
    } catch (err) {
      const error = extractError(err, "Failed to delete conversation");
      set((state) => ({
        loadingStates: { ...state.loadingStates, deletingConversation: false },
        error: { message: error.message, code: error.code },
      }));
      console.error("Error deleting conversation:", error);
      return false;
    }
  },
});
