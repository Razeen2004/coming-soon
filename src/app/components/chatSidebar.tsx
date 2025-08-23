import { FaPlus, FaTrash } from 'react-icons/fa';
import { Chat } from '../types/index';
import { MdOutlineOpenInNew } from "react-icons/md";


interface ChatSidebarProps {
  chats: Chat[];
  currentChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void; // ✅ add delete handler
}

export default function ChatSidebar({
  chats,
  currentChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
}: ChatSidebarProps) {
  return (
    <div className="w-[210px] bg-[#131315] p-4 flex flex-col border-r border-[#262628]">
      <button
        onClick={onNewChat}
        className="flex items-center justify-center text-[14px] bg-[#2D2D33] p-2 rounded mb-4"
      >
        <MdOutlineOpenInNew className="text-[#F2F2F2] text-[20px]" /> New Chat
      </button>

      <div className="flex-1 overflow-y-auto space-y-2">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`flex items-center justify-between p-2 rounded cursor-pointer text-[14px] ${
              chat.id === currentChatId ? 'bg-[#2D2D33]' : 'hover:bg-gray-700'
            }`}
          >
            {/* Chat title with wrapping */}
            <div
              className="flex-1 break-words pr-2 chat-title"
              onClick={() => onSelectChat(chat.id)}
            >
              {chat.title}
            </div>

            {/* Delete button */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // prevent selecting chat when deleting
                onDeleteChat(chat.id);
              }}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <FaTrash size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
