import React, { useEffect, useState } from "react"

import type { ReactNode } from "react"
import { Message } from "../types/index"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism"
import "./css/chatMessages.css"
import toast from 'react-hot-toast'

import like from "@/../public/like.svg"
import dislike from "@/../public/dislike.svg"
import copy from "@/../public/copy.svg"
import reload from "@/../public/reload.svg"
import smallLogo from "@/../public/logo-mini.png"
// Math support
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import "katex/dist/katex.min.css"

// Icons
import Image from "next/image"

interface ChatMessageProps {
  message: Message
  isTyping?: boolean // typing dots
  animateText?: boolean // animate assistant’s text
  onRegenerate?: () => void // callback for regenerate action
}
export default function ChatMessage({
  message,
  isTyping,
  animateText,
  onRegenerate,
}: ChatMessageProps) {
  const isUser = message.role === "user"
  const [displayedText, setDisplayedText] = useState(
    animateText ? "" : message.content
  )

  // Animate assistant text
  useEffect(() => {
    if (animateText && !isUser) {
      let i = 0
      const interval = setInterval(() => {
        setDisplayedText(message.content.slice(0, i + 1))
        i++
        if (i >= message.content.length) {
          clearInterval(interval)
        }

        // auto-scroll as text grows
        const chatBox = document.querySelector(".chat-container")
        if (chatBox) {
          chatBox.scrollTop = chatBox.scrollHeight
        }
      }, 3)

      return () => clearInterval(interval)
    }
  }, [animateText, message.content, isUser])

  // Message actions
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      toast.success('Message copied to clipboard')
    } catch (error) {
      toast.error('Failed to copy message')
    }
  }

  const handleLike = () => {
    toast.success('Message liked')
    // Add your like logic here
  }

  const handleDislike = () => {
    toast.success('Message disliked')
    // Add your dislike logic here
  }

  const handleRegenerate = () => {
    if (onRegenerate) {
      onRegenerate()
      toast.success('Regenerating response...')
    }
  }

  return (
    <div className="flex flex-col my-2 w-[100%]">
      <div
        className={`relative overflow-hidden w-[100%] rounded-lg text-[16px] my-[10px] text-[#F2F2F2] ${isUser
            ? "bg-[#26262C] ml-auto p-4 max-w-[70%] w-[auto] text-left"
            : "mr-auto text-left assistant-message w-full"
          }`}
      >

        {/* Typing or Message */}
        {isTyping && !isUser ? (
          <div
            className="typing-indicator flex items-end justify-start space-x-1 relative"
            aria-live="polite"
            aria-label="Assistant is typing"
          >
            <div>
              <Image
                src={smallLogo}
                alt="Prompt Suite"
                width={30}
                height={30}
              />
            </div>

            <span></span>
            <span></span>
            <span></span>
          </div>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
              code({
                inline,
                className,
                children,
                ...props
              }: {
                inline?: boolean
                className?: string
                children?: ReactNode
              }) {
                const match = /language-(\w+)/.exec(className || "")
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={atomDark as any}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              },
            }}
          >
            {displayedText || ""}
          </ReactMarkdown>
        )}
      </div>
      {!isTyping && !isUser ? (
        <div className="flex gap-3 items-center assistant-icons">
          <button
            onClick={handleLike}
            className="hover:bg-gray-700 rounded transition-colors"
            aria-label="Like message"
          >
            <Image src={like} alt="Like" width={20} height={20} />
          </button>
          <button
            onClick={handleDislike}
            className="hover:bg-gray-700 rounded transition-colors"
            aria-label="Dislike message"
          >
            <Image src={dislike} alt="Dislike" width={20} height={20} />
          </button>
          <button
            onClick={handleCopy}
            className="hover:bg-gray-700 rounded transition-colors"
            aria-label="Copy message"
          >
            <Image src={copy} alt="Copy" width={20} height={20} />
          </button>
          <button
            onClick={handleRegenerate}
            className="hover:bg-gray-700 rounded transition-colors"
            aria-label="Regenerate response"
          >
            <Image src={reload} alt="Regenerate" width={20} height={20} />
          </button>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  )
}
