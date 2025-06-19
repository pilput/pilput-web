import { create } from 'zustand';
import { ChatMessage, type Message } from '@/components/chat/chat-message';
import { axiosInstence2 } from '@/utils/fetch';
import { getToken } from '@/utils/Auth';
import { Config } from '@/utils/getCofig';

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  recentChats: any[];
  fetchRecentChats: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  createConversation: (title: string, message: string, router: any) => Promise<string | null>;
  sendMessage: (content: string, conversationId: string) => Promise<void>;
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
  createConversation: async (title, message, router) => {
    const { isLoading, setIsLoading } = get();
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
      
      const conversationId = response.data.id;
      router.replace('/chat/' + conversationId);
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
    const { isLoading, messages } = get();
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
    
    try {
      const response = await fetch(`${Config.apibaseurl2}/v1/chat/conversations/${conversationId}/messages/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ content }),
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
      
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            if (data === '[DONE]') {
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
                
                // Update the assistant message with accumulated content
                set((state) => ({
                  messages: state.messages.map((msg) =>
                    msg.id === assistantMessage.id
                      ? { ...msg, content: accumulatedContent }
                      : msg
                  ),
                }));
              }
            } catch (parseError) {
              // Skip invalid JSON chunks
              console.warn('Failed to parse streaming data:', parseError);
            }
          }
        }
      }
      
      clearTimeout(timeoutId);
      
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
      clearTimeout(timeoutId);
      set({ isLoading: false });
    }
  },
}));
