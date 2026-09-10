import { create } from "zustand";
import type { ChatState } from "./chat/types";
import { createStreamingSlice } from "./chat/streaming-slice";
import { createConversationsSlice } from "./chat/conversations-slice";
import { createMessagesSlice } from "./chat/messages-slice";

export type {
  ChatError,
  ChatMessageResponse,
  ChatState,
  Conversation,
  ConversationsResponse,
  CreateConversationResponse,
  GetConversationResponse,
  PaginationMeta,
} from "./chat/types";

/**
 * Zustand store for managing chat functionality
 * Handles conversations, messages, streaming, and pagination.
 * State shape and actions live in ./chat/* slices; this file only
 * wires them together so existing `@/stores/chat-store` imports keep working.
 */
export const useChatStore = create<ChatState>()((set, get, store) => ({
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

  ...createStreamingSlice(set, get, store),
  ...createConversationsSlice(set, get, store),
  ...createMessagesSlice(set, get, store),
}));
