'use client';

import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ChatSidebar from './components/chatSidebar';
import ChatInput from './components/chatInput';
import ChatMessage from './components/chatMessage';
import { Chat, Message } from './types/index';

export default function Home() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentChat = chats.find((chat) => chat.id === currentChatId);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [currentChat?.messages]);

  // Load chats from localStorage
  useEffect(() => {
    const savedChats = localStorage.getItem('chats');
    if (savedChats) {
      setChats(JSON.parse(savedChats));
    }
  }, []);

  // Save chats to localStorage
  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem('chats', JSON.stringify(chats));
    }
  }, [chats]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChat?.messages]);

  const handleDeleteChat = (id: string) => {
    setChats((prev) => prev.filter((chat) => chat.id !== id));

    if (currentChatId === id) {
      setCurrentChatId(null); // clear if current chat is deleted
    }
  };

  const handleNewChat = () => {
    const newChat: Chat = {
      id: uuidv4(),
      title: 'New Chat',
      messages: [],
    };
    setChats([newChat, ...chats]);
    setCurrentChatId(newChat.id);
  };

  const handleSendMessage = async (content: string) => {
    let chatId = currentChatId;

    // ✅ Auto-create chat if none exists
    if (!chatId) {
      const newChat: Chat = {
        id: uuidv4(),
        title: 'New Chat',
        messages: [],
      };
      setChats((prev) => [newChat, ...prev]);
      setCurrentChatId(newChat.id);
      chatId = newChat.id;
    }

    const userMessage: Message = { id: uuidv4(), content, role: 'user' };
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? { ...chat, messages: [...chat.messages, userMessage] }
          : chat
      )
    );

    setIsLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...(chats.find((c) => c.id === chatId)?.messages || []),
            userMessage,
          ],
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`API error: ${res.status} - ${errorText}`);
      }

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      const assistantMessage: Message = {
        id: uuidv4(),
        content: data.content,
        role: 'assistant',
      };

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId
            ? { ...chat, messages: [...chat.messages, assistantMessage] }
            : chat
        )
      );

      // ✅ Update title if first message
      if ((chats.find((c) => c.id === chatId)?.messages.length || 0) === 0) {
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === chatId
              ? { ...chat, title: content.slice(0, 30) + '...' }
              : chat
          )
        );
      }
    } catch (error: any) {
      console.error('Error fetching response:', error);
      const errorMessage: Message = {
        id: uuidv4(),
        content: `Error: ${error.message}`,
        role: 'assistant',
      };
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId
            ? { ...chat, messages: [...chat.messages, errorMessage] }
            : chat
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#1A1A1D] screenbox">
      <ChatSidebar
        chats={chats}
        currentChatId={currentChatId}
        onNewChat={handleNewChat}
        onSelectChat={setCurrentChatId}
        onDeleteChat={handleDeleteChat}
      />
      <div className="flex-1 flex flex-col w-[calc(100vw-210px)] max-w-[calc(100vw-210px)] content-area">
        <div className="flex-1 overflow-y-auto p-4 space-y-4 chat-container">
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto px-4 py-2"
          >
            {currentChat?.messages.map((msg, i) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                animateText={i === currentChat.messages.length - 1 && msg.role === "assistant"}
              />
            ))}

            {/* Typing dots bubble */}
            {isLoading && currentChatId && (
              <ChatMessage
                isTyping
                message={{ id: "typing", role: "assistant", content: "" }}
              />
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>
        {/* ✅ Input only disabled when loading */}
        <ChatInput onSend={handleSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
}
