// sidebar.tsx
import { FaPlus, FaTrash } from "react-icons/fa";
import { Chat } from "../types/index";
import { MdOutlineOpenInNew } from "react-icons/md";

interface ChatSidebarProps {
  chats: Chat[];
  currentChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  isOpen: boolean; // <-- control visibility
  onClose: () => void;
}

export default function ChatSidebar({
  chats,
  currentChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  isOpen,
  onClose,
}: ChatSidebarProps) {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`${isOpen ? "translate-x-0" : "translate-x"}`}
      >
        <button
          onClick={onNewChat}
          className="flex items-center gap-2 justify-center text-[14px] bg-[#2D2D33] p-2 rounded mb-4 w-full"
        >
          <MdOutlineOpenInNew className="text-[#F2F2F2] text-[15px]" /> New Chat
        </button>

        <div className="flex-1 overflow-y-auto space-y-2">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`flex items-center justify-between p-2 rounded cursor-pointer text-[14px] ${
                chat.id === currentChatId
                  ? "bg-[#2D2D33]"
                  : "hover:bg-gray-700"
              }`}
            >
              <div
                className="flex-1 break-words pr-2 chat-title"
                onClick={() => onSelectChat(chat.id)}
              >
                {chat.title}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
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
    </>
  );
}
