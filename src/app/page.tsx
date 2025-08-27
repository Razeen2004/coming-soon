'use client';

import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ChatSidebar from './components/chatSidebar';
import ChatInput from './components/chatInput';
import ChatMessage from './components/chatMessage';
import { Chat, Message } from './types/index';
import { FiMenu } from 'react-icons/fi';
import largeLogo from "@/../public/logo.png"
import Image from 'next/image';

export default function Home() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const currentChat = chats.find((chat) => chat.id === currentChatId);

  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      setCurrentChatId(null);
    }
  };

  const handleNewChat = () => {
    const newChat: Chat = { id: uuidv4(), title: 'New Chat', messages: [] };
    setChats([newChat, ...chats]);
    setCurrentChatId(newChat.id);
  };

  const handleRegenerate = async (chatId: string) => {
    const chat = chats.find((c) => c.id === chatId);
    if (!chat || chat.messages.length < 2) return;

    // Get the last user message
    const lastUserMessage = [...chat.messages].reverse().find(m => m.role === 'user');
    if (!lastUserMessage) return;

    // Remove the last assistant message
    setChats(prev => 
      prev.map(c => 
        c.id === chatId 
          ? { ...c, messages: c.messages.slice(0, -1) }
          : c
      )
    );

    // Regenerate the response
    await handleSendMessage(lastUserMessage.content, chatId);
  };

  const handleSendMessage = async (content: string, existingChatId?: string) => {
    let chatId = currentChatId;

    if (!chatId) {
      const newChat: Chat = { id: uuidv4(), title: 'New Chat', messages: [] };
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
      // Get the current chat
      const currentChat = chats.find((c) => c.id === chatId);
      
      // Send the entire conversation history
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...(currentChat?.messages || []),  // Include all previous messages
            userMessage,  // Add the new message
          ],
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`API error: ${res.status} - ${errorText}`);
      }

      const data = await res.json();
      if (data.error) throw new Error(data.error);

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
      {/* Sidebar */}
      <div
        className={`fixed p-2 md:static top-0 left-0 h-full w-[220px] bg-[#111] z-40 transform transition-transform duration-300 navarea 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <ChatSidebar
          chats={chats}
          currentChatId={currentChatId}
          onNewChat={handleNewChat}
          onSelectChat={(id) => {
            setCurrentChatId(id);
            setIsSidebarOpen(false);
          }}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onDeleteChat={handleDeleteChat}
        />
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col w-full md:w-[calc(100vw-220px)] chat-area">
        {/* Mobile Header */}
        <div className='container'>
          <div className="md:hidden flex items-center justify-between p-3 bg-[#131315] text-white navbar">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <FiMenu size={22} />
            </button>
            <span className="text-sm font-semibold">
              {currentChat?.title || 'New Chat'}
            </span>
            <div className="w-[22px]" /> {/* spacer */}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 chat-container messages-text-area">
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto px-2 md:px-4 py-2"
            >
              {currentChat?.messages.map((msg, i) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  animateText={
                    i === currentChat.messages.length - 1 &&
                    msg.role === 'assistant'
                  }
                />
              ))}

              {(!currentChat || currentChat.messages.length === 0) && (
                <div className="text-center text-[14px] text-[#F2F2F2] mt-[100px] px-4">
                  <Image src={largeLogo} alt="Logo" width={200} height={80} className="mb-4 mx-auto" />
                  <h2 className="mb-2 text-[20px]">Welcome to Prompt Suite!</h2>
                  <p className='opacity-[0.8]'>Ask me anything, and I'll do my best to assist you.</p>
                </div>
              )}
              {isLoading && currentChatId && (
                <ChatMessage
                  isTyping
                  message={{ id: 'typing', role: 'assistant', content: '' }}
                />
              )}
            </div>
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <ChatInput onSend={handleSendMessage} disabled={isLoading} />
        </div>
      </div>
    </div>
  );
}
