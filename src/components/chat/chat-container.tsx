'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ChatHeader } from './chat-header';
import { ChatInput } from './chat-input';
import { ChatMessage, type Message } from './chat-message';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatContainerProps {
  chatId: string;
  onUpdateTitle: (id: string, title: string) => void;
}

// Sample initial messages
const initialMessages: Message[] = [
  {
    id: '1',
    content: 'Hello! I\'m your AI assistant. How can I help you today?',
    role: 'assistant',
    timestamp: new Date(),
    isStreaming: false,
  },
  {
    id: '2',
    content: 'I need help with my project.',
    role: 'user',
    timestamp: new Date(),
    isStreaming: false,
  },
  {
    id: '3',
    content: 'Sure! I\'d be happy to help. What kind of project are you working on?',
    role: 'assistant',
    timestamp: new Date(),
    isStreaming: false,
  },
];

export function ChatContainer({ chatId, onUpdateTitle }: ChatContainerProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  // Initial scroll to bottom
  useEffect(() => {
    scrollToBottom('auto');
  }, [scrollToBottom]);

  // Handle new messages being added
  useEffect(() => {
    if (messages.length > 1) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    // Add user message
    const newMessage: Message = {
      id: Date.now().toString(),
      content: content,
      role: 'user',
      timestamp: new Date(),
      isStreaming: false,
    };

    // Create a temporary AI message that will be updated with streaming response
    const tempAiMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: '',
      role: 'assistant',
      timestamp: new Date(),
      isStreaming: true, // Set to true for streaming effect
    };

    // Update messages with user message and temporary AI message
    setMessages(prev => [...prev, newMessage, tempAiMessage]);
    setIsLoading(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_2}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add any authentication headers if needed
          // 'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content }],
          // Add any additional parameters your API expects
          stream: true, // Ensure streaming is enabled if your API supports it
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let aiResponse = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          // Process the chunk (adjust based on your API's response format)
          const chunk = decoder.decode(value, { stream: true });
          aiResponse += chunk;
          
          // Update the AI message with the latest chunk
          setMessages(prev => 
            prev.map(msg => 
              msg.id === tempAiMessage.id 
                ? { ...msg, content: aiResponse.trim(), isStreaming: true } 
                : msg
            )
          );
        }
      }


      // Replace the temporary message with the final one
      const finalAiMessage: Message = {
        id: Date.now().toString(),
        content: aiResponse.trim(),
        role: 'assistant',
        timestamp: new Date(),
        isStreaming: false,
      };

      setMessages(prev => [
        ...prev.filter(msg => msg.id !== tempAiMessage.id),
        finalAiMessage
      ]);

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Remove the temporary message and add an error message
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== tempAiMessage.id);
        const errorMessage: Message = {
          id: `error-${Date.now()}`,
          content: 'Sorry, I encountered an error. Please try again.',
          role: 'assistant',
          timestamp: new Date(),
          isStreaming: false,
        };
        return [...filtered, errorMessage];
      });
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* Messages area */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden py-4 min-h-0"
      >
        <div className="max-w-3xl mx-auto w-full px-4 h-full">
          {messages.map((message, index) => (
            <ChatMessage 
              key={`${message.id}-${index}`} 
              message={message} 
              className={index === messages.length - 1 ? 'pb-20' : ''}
              onEdit={(id, content) => {
                setMessages(prev => 
                  prev.map(msg => 
                    msg.id === id ? { ...msg, content } : msg
                  )
                );
              }}
              onFeedback={(id, type) => {
                // Handle feedback (e.g., send to analytics)
                console.log(`Feedback for message ${id}: ${type}`);
              }}
            />
          ))}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>
      
      {/* Input area - fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-3xl mx-auto w-full p-4">
          <ChatInput onSendMessage={handleSendMessage} isDisabled={isLoading} />
          <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
            AI Assistant may produce inaccurate information about people, places, or facts.
          </p>
        </div>
      </div>
    </div>
  );
}
