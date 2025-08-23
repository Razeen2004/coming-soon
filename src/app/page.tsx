'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ChatSidebar from './components/chatSidebar';
import ChatInput from './components/chatInput';
import ChatMessage from './components/chatMessage';
import { Chat, Message } from './types/index';

export default function Home() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedChats = localStorage.getItem('chats');
    if (savedChats) {
      setChats(JSON.parse(savedChats));
    }
  }, []);

  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem('chats', JSON.stringify(chats));
    }
  }, [chats]);

  const currentChat = chats.find((chat) => chat.id === currentChatId);

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
    if (!currentChatId) return;

    const userMessage: Message = { id: uuidv4(), content, role: 'user' };
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === currentChatId
          ? { ...chat, messages: [...chat.messages, userMessage] }
          : chat
      )
    );

    setIsLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...(currentChat?.messages || []), userMessage] }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Request Timed out or failed`);
      }

      const assistantMessageId = uuidv4();
      let assistantContent = '';

      // Create assistant message placeholder
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === currentChatId
            ? {
              ...chat,
              messages: [...chat.messages, { id: assistantMessageId, content: '', role: 'assistant' }],
            }
            : chat
        )
      );

      // Process streaming response
      const reader = res.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter((line) => line.trim());

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content;
              if (content) {
                assistantContent += content;
                setChats((prev) =>
                  prev.map((chat) =>
                    chat.id === currentChatId
                      ? {
                        ...chat,
                        messages: chat.messages.map((msg) =>
                          msg.id === assistantMessageId
                            ? { ...msg, content: assistantContent }
                            : msg
                        ),
                      }
                      : chat
                  )
                );
              }
            } catch (jsonError) {
              console.warn('Invalid JSON chunk:', data); // Log invalid chunks but don't throw
            }
          }
        }
      }

      // Update chat title if first message
      if ((currentChat?.messages.length || 0) === 0) {
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === currentChatId ? { ...chat, title: content.slice(0, 30) + '...' } : chat
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
          chat.id === currentChatId
            ? { ...chat, messages: [...chat.messages, errorMessage] }
            : chat
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#1B1B1D]">
      <ChatSidebar
        chats={chats}
        currentChatId={currentChatId}
        onNewChat={handleNewChat}
        onSelectChat={setCurrentChatId}
      />
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {currentChat ? (
            currentChat.messages.map((msg: any) => <ChatMessage key={msg.id} message={msg} />)
          ) : (
            <div className="text-center mt-20">Select or start a new chat</div>
          )}
        </div>
        <ChatInput onSend={handleSendMessage} disabled={!currentChatId || isLoading} />
      </div>
    </div>
  );
}