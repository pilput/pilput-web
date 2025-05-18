"use client";

import { useEffect, useState } from "react";
import { ChatContainer } from "@/components/chat/chat-container";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { axiosInstence2 } from "@/utils/fetch";
import { getToken } from "@/utils/Auth";

type Chat = {
  id: string;
  title: string;
  updatedAt: Date;
};

export default function ChatPage() {
  const { setTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentConvertations, setCurrentConvertations] = useState<string>("");

  const [recentChats, setRecentChats] = useState<any[]>([]);

  function getConvertions() {
    axiosInstence2
      .get("/v1/chat/conversations", {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((res: any) => {
        setRecentChats(res.data);
      });
  }

  // Set dark theme by default for the chat interface
  useEffect(() => {
    setTheme("dark");
  }, [setTheme]);

  const handleNewChat = () => {
    setCurrentConvertations("");
    setIsSidebarOpen(false);
  };

  const handleSelectChat = (id: string) => {
    setCurrentConvertations(id);
    setIsSidebarOpen(false);
  };

  const handleUpdateCurrentConvertations = (id: string) => {
    setCurrentConvertations(id);
  };

  const updateChatTitle = (id: string, title: string) => {
    setCurrentConvertations(id);
  };

  useEffect(() => {
    getConvertions();
  }, [currentConvertations]);

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
        onCreateNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        recentChats={recentChats}
        currentConvertations={currentConvertations}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col h-full min-h-0">
        <div className="flex-1 flex flex-col min-h-0">
          <ChatContainer
            key={currentConvertations}
            currentConvertations={currentConvertations}
            onUpdateTitle={updateChatTitle}
            onUpdateCurrentConvertations={handleUpdateCurrentConvertations}
          />
        </div>

        {/* Minimal Footer */}
        <div className="border-t border-gray-800 py-3 px-4 text-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} pilput. An AI-powered conversation.
          </p>
        </div>
      </div>
    </div>
  );
}
