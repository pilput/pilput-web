import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CardHeader } from '@/components/ui/card';

export function ChatHeader() {
  return (
    <CardHeader className="border-b p-4">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src="/ai-avatar.png" alt="AI Assistant" />
          <AvatarFallback className="bg-primary/10">AI</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-semibold">AI Assistant</h3>
          <p className="text-xs text-muted-foreground">Online</p>
        </div>
      </div>
    </CardHeader>
  );
}
