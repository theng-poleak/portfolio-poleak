import { ChatView } from "@/components/chat/chat-view";
import { getContent } from "@/lib/content";

export default function HomePage() {
  return <ChatView greetings={getContent().profile.sections.greetings} />;
}
