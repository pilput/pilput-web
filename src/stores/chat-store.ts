import { create } from 'zustand';
import { ChatMessage, type Message } from '@/components/chat/chat-message';
import { axiosInstence2 } from '@/utils/fetch';
import { getToken } from '@/utils/Auth';
import { Config } from '@/utils/getCofig';

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  recentChats: any[];
  selectedModel: string;
  availableModels: { id: string; name: string }[];
  fetchRecentChats: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  createConversation: (title: string, message: string, router: any) => Promise<string | null>;
  sendMessage: (content: string, conversationId: string) => Promise<void>;
  setMessages: (messages: Message[]) => void;
  editMessage: (id: string, content: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  setSelectedModel: (model: string) => void;
  isNewConversation: boolean;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [
  ],
  isLoading: false,
  recentChats: [],
  // Default to Llama 4 Maverick free model
  selectedModel: 'openai/gpt-oss-20b:free',
  // List of free models available on OpenRouter
  availableModels: [
    { id: 'deepseek/deepseek-chat-v3.1:free', name: 'DeepSeek V3.1' },
    { id: 'qwen/qwen3-coder:free', name: 'Qwen 3 Coder' },
    { id: 'meta-llama/llama-4-maverick:free', name: 'Llama 4 Maverick' },
    { id: 'meta-llama/llama-4-scout:free', name: 'Llama 4 Scout' },
    { id: 'meta-llama/llama-3-8b-instruct:free', name: 'Meta Llama 3 8B' },
    { id: 'google/gemma-7b-it:free', name: 'Gemma 7B' },
    { id: 'openai/gpt-oss-20b:free', name: 'GPT-OSS 20B' },
    { id: 'mistralai/mistral-7b-instruct:free', name: 'Mistral 7B Instruct' },
    { id: 'google/gemini-flash-1.5:free', name: 'Gemini Flash 1.5' },
    { id: 'anthropic/claude-3-haiku:free', name: 'Claude 3 Haiku' },
    { id: 'z-ai/glm-4.5-air:free', name: 'GLM 4.5 Air' },
    { id: 'moonshotai/kimi-k2:free', name: 'Kimi K2' },
  ],
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
  fetchRecentChats: async () => {
    try {
      const response = await axiosInstence2.get('/v1/chat/conversations', {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      set({ recentChats: response.data.data });
    } catch (err) {
      // Optionally handle logout here, or expose error to UI
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
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
}));
