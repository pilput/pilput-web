import type { StateCreator } from "zustand";
import type { Message } from "@/components/chat/chat-message";
import type { ChatState } from "./types";
import {
  extractError,
  sanitizeString,
  validateConversationId,
  validateMessage,
} from "./utils";

export type MessagesSlice = Pick<
  ChatState,
  | "setMessages"
  | "editMessage"
  | "setSelectedModel"
  | "clearError"
  | "resetChat"
  | "sendMessage"
>;

export const createMessagesSlice: StateCreator<
  ChatState,
  [],
  [],
  MessagesSlice
> = (set, get) => ({
  // Basic setters
  setMessages: (messages) => set({ messages }),
  setSelectedModel: (model) => set({ selectedModel: model }),
  clearError: () => set({ error: null }),

  editMessage: (id, content) => {
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, content } : msg,
      ),
    }));
  },

  resetChat: () => {
    get().abortActiveStream();
    set({
      messages: [],
      isNewConversation: false,
      error: null,
    });
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
    } catch (err) {
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
});
