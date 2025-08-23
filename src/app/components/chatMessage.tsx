import { useEffect, useState } from "react"
import type { ReactNode } from "react"
import { Message } from "../types/index"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism"
import "./css/chatMessages.css"

interface ChatMessageProps {
  message: Message
  isTyping?: boolean // typing dots
  animateText?: boolean // animate assistant’s text
}

export default function ChatMessage({ message, isTyping, animateText }: ChatMessageProps) {
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
      }, 6)

      return () => clearInterval(interval)
    }
  }, [animateText, message.content, isUser])


  return (
    <div className="flex justify-center items-center my-2 px-[20%]">
      <div
        className={`overflow-hidden rounded-lg text-[16px] my-[10px] text-[#F2F2F2] ${isUser
            ? "bg-[#26262C] ml-auto p-4 max-w-[70%] text-left"
            : "mr-auto bg-transparent text-left assistant-message p-4"
          }`}
      >
        {isTyping && !isUser ? (
          <div className="typing-indicator" aria-live="polite" aria-label="Assistant is typing">
            <span></span><span></span><span></span>
          </div>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
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
    </div>
  )
}
