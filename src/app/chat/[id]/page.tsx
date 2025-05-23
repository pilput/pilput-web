import { ChatContainer } from "@/components/chat/chat-container";

type Params = Promise<{ id: string }>;

export default async function ChatPage(props: { params: Params }) {
  const params = await props.params;
  const currentConvertations = params.id;

  return (
    <ChatContainer
      key={currentConvertations}
      currentConvertations={currentConvertations}
    />
  );
}
