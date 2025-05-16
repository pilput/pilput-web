'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Plus, MessageSquare, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  chats: Array<{
    id: string;
    title: string;
    updatedAt: Date;
  }>;
  onCreateNewChat: () => void;
  onSelectChat: (id: string) => void;
}

export function ChatSidebar({
  isOpen,
  onClose,
  chats,
  onCreateNewChat,
  onSelectChat,
}: ChatSidebarProps) {
  const pathname = usePathname();
  const [isHoveringClose, setIsHoveringClose] = useState(false);

  // Mock recent chats - in a real app, this would come from your data store
  const recentChats = chats || [
    { id: '1', title: 'New conversation', updatedAt: new Date() },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 border-r border-gray-800 transform transition-transform duration-200 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0 lg:static lg:inset-auto lg:z-auto',
          'flex flex-col h-screen'
        )}
      >
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Chat History</h2>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-8 w-8"
            onClick={onClose}
            onMouseEnter={() => setIsHoveringClose(true)}
            onMouseLeave={() => setIsHoveringClose(false)}
          >
            {isHoveringClose ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>

        <div className="p-2">
          <Button
            variant="outline"
            className="w-full justify-start gap-2 text-sm"
            onClick={onCreateNewChat}
          >
            <Plus className="h-4 w-4" />
            New chat
          </Button>
        </div>

        <ScrollArea className="flex-1 px-2">
          <div className="space-y-1">
            {recentChats.map((chat) => (
              <Button
                key={chat.id}
                variant="ghost"
                className={cn(
                  'w-full justify-start font-normal text-sm text-left overflow-hidden text-ellipsis whitespace-nowrap',
                  pathname.includes(chat.id) && 'bg-gray-800'
                )}
                onClick={() => onSelectChat(chat.id)}
              >
                <MessageSquare className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="truncate">{chat.title}</span>
              </Button>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-gray-800">
          <div className="text-xs text-gray-500">
            <p>Your conversations are saved in your browser.</p>
          </div>
        </div>
      </aside>
    </>
  );
}
