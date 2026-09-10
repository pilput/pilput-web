import type { Message } from "@/components/chat/chat-message";

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

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  total_items?: number; // Some APIs might use this
}

export interface ConversationsResponse {
  data: Conversation[];
  meta: PaginationMeta;
}

export interface CreateConversationResponse {
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
export interface GetConversationResponse {
  data: Conversation & {
    chat_messages: ChatMessageResponse[];
  };
}

export interface ChatError {
  message: string;
  code?: string;
}

export interface ChatState {
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
