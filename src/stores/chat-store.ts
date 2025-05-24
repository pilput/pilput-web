import { create } from 'zustand';
import { ChatMessage, type Message } from '@/components/chat/chat-message';
import { axiosInstence2 } from '@/utils/fetch';
import { getToken } from '@/utils/Auth';

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  recentChats: any[];
  fetchRecentChats: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  sendMessage: (content: string, conversationId: string, router: any) => Promise<void>;
  setMessages: (messages: Message[]) => void;
  editMessage: (id: string, content: string) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [
    {
      id: Date.now().toString(),
      content: 'message',
      role: 'user',
      createdAt: new Date(),
      isStreaming: false,
    },
  ],
  isLoading: false,
  recentChats: [],
  setMessages: (messages) => set({ messages }),
  setIsLoading: (isLoading) => set({ isLoading }),
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
      set({ recentChats: response.data });
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
      const data = response.data;
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
  sendMessage: async (content, conversationId, router) => {
    const { isLoading, messages, setMessages, setIsLoading, fetchMessages } = get();
    if (!content.trim() || isLoading) return;
    const newmessage = {
      id: Date.now().toString(),
      content: content,
      role: 'user' as const,
      createdAt: new Date(),
      isStreaming: false,
    };
    set({ messages: [...messages, newmessage], isLoading: true });
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    try {
      let endpoint: string;
      let data: any;
      if (conversationId === '') {
        endpoint = `/v1/chat/conversations`;
        data = {
          title: content.slice(0, 15) + (content.length > 15 ? '' : ''),
          message: content,
        };
      } else {
        endpoint = `/v1/chat/conversations/${conversationId}/messages`;
        data = { content };
      }
      const response = await axiosInstence2(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        data,
      });
      clearTimeout(timeoutId);
      if (response.status !== 201) throw new Error(`HTTP error! status: ${response.status}`);
      if (conversationId === '') {
        router.replace('/chat/' + response.data.id);
      } else {
        await fetchMessages(conversationId);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      set((state) => {
        const filtered = state.messages.filter((msg) => msg.id !== newmessage.id);
        const errorMessage: Message = {
          id: `error-${Date.now()}`,
          content: 'Sorry, I encountered an error. Please try again.',
          role: 'assistant',
          createdAt: new Date(),
          isStreaming: false,
        };
        return { messages: [...filtered, errorMessage] };
      });
    } finally {
      clearTimeout(timeoutId);
      set({ isLoading: false });
    }
  },
}));
