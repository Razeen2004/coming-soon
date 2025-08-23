import { FaPlus } from 'react-icons/fa';
import { Chat } from '../types/index';

interface ChatSidebarProps {
  chats: Chat[];
  currentChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
}

export default function ChatSidebar({
  chats,
  currentChatId,
  onNewChat,
  onSelectChat,
}: ChatSidebarProps) {
  return (
    <div className="w-[210px] bg-[#131315] p-4 flex flex-col border-r border-[#262628]">
      <button
        onClick={onNewChat}
        className="flex items-center justify-center text-[14px] bg-[#2D2D33] p-2 rounded mb-4"
      >
        <FaPlus className="mr-2" /> New Chat
      </button>
      <div className="flex-1 overflow-y-auto space-y-2">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`p-2 rounded cursor-pointer text-[14px] ${
              chat.id === currentChatId ? 'bg-[#2D2D33]' : 'hover:bg-gray-700'
            }`}
          >
            {chat.title}
          </div>
        ))}
      </div>
    </div>
  );
}