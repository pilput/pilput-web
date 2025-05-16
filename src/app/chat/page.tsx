"use client";

import { useEffect, useState } from "react";
import { ChatContainer } from "@/components/chat/chat-container";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useTheme } from "next-themes";

type Chat = {
  id: string;
  title: string;
  updatedAt: Date;
};

export default function ChatPage() {
  const { setTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chats, setChats] = useState<Chat[]>(() => {
    // Load chats from localStorage if available
    if (typeof window !== 'undefined') {
      const savedChats = localStorage.getItem('chatHistory');
      return savedChats ? JSON.parse(savedChats) : [
        { id: '1', title: 'New conversation', updatedAt: new Date() }
      ];
    }
    return [];
  });
  const [currentChatId, setCurrentChatId] = useState<string>('1');

  // Set dark theme by default for the chat interface
  useEffect(() => {
    setTheme("dark");
  }, [setTheme]);

  // Save chats to localStorage when they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('chatHistory', JSON.stringify(chats));
    }
  }, [chats]);

  const handleNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: 'New conversation',
      updatedAt: new Date(),
    };
    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
    setIsSidebarOpen(false);
  };

  const handleSelectChat = (id: string) => {
    setCurrentChatId(id);
    setIsSidebarOpen(false);
  };

  const updateChatTitle = (id: string, title: string) => {
    setChats(prev =>
      prev.map(chat =>
        chat.id === id ? { ...chat, title, updatedAt: new Date() } : chat
      )
    );
  };

  return (
    <div className="h-screen w-full bg-gray-900 text-gray-100 flex overflow-hidden">
      {/* Mobile sidebar toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-20 lg:hidden h-10 w-10"
        onClick={() => setIsSidebarOpen(true)}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Open sidebar</span>
      </Button>

      {/* Sidebar */}
      <ChatSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        chats={chats}
        onCreateNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col h-full min-h-0">
        <div className="flex-1 flex flex-col min-h-0">
          <ChatContainer 
            key={currentChatId} 
            chatId={currentChatId}
            onUpdateTitle={updateChatTitle}
          />
        </div>

        {/* Minimal Footer */}
        <div className="border-t border-gray-800 py-3 px-4 text-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} AI Assistant. An AI-powered conversation.
          </p>
        </div>
      </div>
    </div>
  );
}
