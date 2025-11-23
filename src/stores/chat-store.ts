import { create } from 'zustand';
import { type Message } from '@/components/chat/chat-message';
import { axiosInstence, axiosInstence2 } from '@/utils/fetch';
import { getToken } from '@/utils/Auth';
import { Config } from '@/utils/getCofig';

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  conversations: any[];
  selectedModel: string;
  availableModels: { id: string; name: string }[];
  conversationsPagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
  fetchRecentChats: (page?: number, limit?: number) => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  createConversation: (title: string, message: string, router: any) => Promise<string | null>;
  resetPagination: () => void;
  sendMessage: (content: string, conversationId: string) => Promise<void>;
  deleteConversation: (conversationId: string) => Promise<boolean>;
  setMessages: (messages: Message[]) => void;
  editMessage: (id: string, content: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  setSelectedModel: (model: string) => void;
  isNewConversation: boolean;
  loadMoreConversations: () => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [
  ],
  isLoading: false,
  conversations: [],
  // Default to OpenAI GPT-OSS 20B model
  selectedModel: 'openai/gpt-oss-20b',
  // List of most popular free models available on OpenRouter
  availableModels: [
    { id: 'qwen/qwen3-14b:free', name: 'Qwen 3 14B' },
    { id: 'deepseek/deepseek-chat-v3.1:free', name: 'DeepSeek V3.1' },
    { id: 'tngtech/deepseek-r1t2-chimera:free', name: 'DeepSeek R1T2 Chimera' },
    { id: 'anthropic/claude-3-haiku:free', name: 'Claude 3 Haiku' },
    { id: 'meta-llama/llama-3-8b-instruct:free', name: 'Meta Llama 3 8B' },
    { id: 'mistralai/mistral-small-3.1-24b-instruct:free', name: 'Mistral Small 3.1 24B' },
    { id: 'openai/gpt-oss-20b', name: 'OpenAI GPT-OSS 20B' },
  ],
  conversationsPagination: {
    page: 0,
    limit: 10,
    total: 0,
    hasMore: true,
  },
  isNewConversation: false,
  setMessages: (messages) => set({ messages }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setSelectedModel: (model) => set({ selectedModel: model }),
  editMessage: (id, content) => {
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, content } : msg
      ),
    }));
  },
  fetchRecentChats: async (page = 0, limit = 15) => {
    try {
      set({ isLoading: true });
      
      const response = await axiosInstence.get('/v1/chat/conversations', {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        params: {
          offset: page * limit,
          limit,
        },
      });
      
      const { data, meta } = response.data;
      
      set((state) => {
        const isReset = page === 0;
        const total = meta?.total_items || data?.length || 0;
        const totalPages = meta?.total_pages || Math.ceil(total / limit);
        const currentPage = page;
        const hasMore = currentPage + 1 < totalPages;

        // Ensure no duplicate chats by using a Map keyed by chat.id
        const chatMap = new Map();
        if (!isReset) {
          state.conversations.forEach((chat: any) => chatMap.set(chat.id, chat));
        }
        data.forEach((chat: any) => chatMap.set(chat.id, chat));
        const uniqueChats = Array.from(chatMap.values());

        // If loading more and no new unique items were added, stop pagination
        const hasNewItems = uniqueChats.length > state.conversations.length;
        const effectiveHasMore = isReset ? hasMore : (hasMore && hasNewItems);

        return {
          conversations: uniqueChats,
          conversationsPagination: {
            page: currentPage,
            limit,
            total,
            hasMore: effectiveHasMore,
          },
          isLoading: false,
        };
      });
    } catch (err) {
      set({ isLoading: false });
      // Optionally handle logout here, or expose error to UI
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  },
  loadMoreConversations: async () => {
    const { conversationsPagination, fetchRecentChats, isLoading } = get();
    if (!conversationsPagination.hasMore || isLoading) return;
    
    const nextPage = conversationsPagination.page + 1;
    await fetchRecentChats(nextPage, conversationsPagination.limit);
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
    try {
      const response = await axiosInstence2(`/v1/chat/conversations/${conversationId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
      });
      if (response.status !== 200) throw new Error(`HTTP error! status: ${response.status}`);
      const data = response.data.data;
      set({
        messages: data.messages.map((message: any) => ({
          ...message,
          createdAt: new Date(message.createdAt),
        })),
      });
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  },
  createConversation: async (title, message, router) => {
    const { isLoading, setIsLoading, selectedModel, sendMessage } = get();
    if (!message.trim() || isLoading) return null;

    setIsLoading(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await axiosInstence2('/v1/chat/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        data: {
          title: title || message.slice(0, 15) + (message.length > 15 ? '...' : ''),
          message,
        },
      });

      clearTimeout(timeoutId);
      if (response.status !== 201) throw new Error(`HTTP error! status: ${response.status}`);

      const conversationId = response.data.data.id;

      set({
        isNewConversation: true,
        messages: [],
        // Reset pagination when creating new conversation to ensure fresh state
        conversations: [],
        conversationsPagination: {
          page: 0,
          limit: 15,
          total: 0,
          hasMore: true,
        },
      })

      router.replace('/chat/' + conversationId);

      // Automatically send the initial message as a streaming chat
      setTimeout(() => {
        sendMessage(message, conversationId);
      }, 100); // Small delay to ensure page navigation completes

      return conversationId;
    } catch (error) {
      console.error('Error creating conversation:', error);
      return null;
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  },
  sendMessage: async (content, conversationId) => {
    const { isLoading, messages, selectedModel } = get();
    if (!content.trim() || isLoading || !conversationId) return;

    const userMessage = {
      id: Date.now().toString(),
      content: content,
      role: 'user' as const,
      createdAt: new Date(),
      isStreaming: false,
    };

    // Add user message and create placeholder for assistant response
    const assistantMessage = {
      id: `assistant-${Date.now()}`,
      content: '',
      role: 'assistant' as const,
      createdAt: new Date(),
      isStreaming: true,
    };

    set({
      messages: [...messages, userMessage, assistantMessage],
      isLoading: true
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // Increased timeout for streaming
    let updateTimeout: number | null = null; // Move to broader scope

    try {
      const response = await fetch(`${Config.apibaseurl2}/v1/chat/conversations/${conversationId}/messages/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          content,
          model: selectedModel // Include the selected model in the request
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body reader available');
      }

      let accumulatedContent = '';

      // Batch updates to reduce re-renders
      const batchedUpdate = () => {
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === assistantMessage.id
              ? { ...msg, content: accumulatedContent }
              : msg
          ),
        }));
      };

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();

            if (data === '[DONE]') {
              // Clear any pending updates and finalize
              if (updateTimeout) {
                clearTimeout(updateTimeout);
                updateTimeout = null;
              }
              batchedUpdate();
              // Stream completed
              set((state) => ({
                messages: state.messages.map((msg) =>
                  msg.id === assistantMessage.id
                    ? { ...msg, isStreaming: false }
                    : msg
                ),
              }));
              break;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                accumulatedContent += parsed.content;

                // Batch updates to avoid too frequent re-renders
                if (updateTimeout) {
                  clearTimeout(updateTimeout);
                }
                updateTimeout = window.setTimeout(batchedUpdate, 16); // ~60fps
              }
            } catch (parseError) {
              // Skip invalid JSON chunks
              console.warn('Failed to parse streaming data:', parseError);
            }
          }
        }
      }

      // Clear any pending update timeout
      if (updateTimeout) {
        clearTimeout(updateTimeout);
      }
      clearTimeout(timeoutId);
      set({ isNewConversation: false });

    } catch (error) {
      console.error('Error sending message:', error);
      set((state) => {
        const filtered = state.messages.filter((msg) =>
          msg.id !== userMessage.id && msg.id !== assistantMessage.id
        );
        const errorMessage: Message = {
          id: `error-${Date.now()}`,
          content: 'Sorry, I encountered an error. Please try again.',
          role: 'assistant',
          createdAt: new Date(),
          isStreaming: false,
        };
        return { messages: [...filtered, userMessage, errorMessage] };
      });
    } finally {
      // Clear any pending update timeout
      if (updateTimeout) {
        clearTimeout(updateTimeout);
      }
      clearTimeout(timeoutId);
      set({ isLoading: false });
    }
  },
  deleteConversation: async (conversationId) => {
    try {
      const response = await axiosInstence2.delete(`/v1/chat/conversations/${conversationId}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (response.status === 200) {
        // Remove the conversation from conversations
        set((state) => ({
          conversations: state.conversations.filter(chat => chat.id !== conversationId)
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting conversation:', error);
      return false;
    }
  },
}));
