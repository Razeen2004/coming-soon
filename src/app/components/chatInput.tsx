import { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { debounce } from 'lodash';
import { RiLoader2Fill } from "react-icons/ri";
import { VscSend } from "react-icons/vsc";
import Image from 'next/image';
import sendIcon from "@/../public/submit-icon.svg";

interface ChatInputProps {
    onSend: (content: string) => void;
    disabled: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
    const [input, setInput] = useState('');

    const debouncedSend = debounce((content: string) => {
        if (content.trim()) {
            onSend(content);
            setInput('');
        }
    }, 1000);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        debouncedSend(input);
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="p-4 border rounded-tl-[12px] rounded-tr-[12px] border-[#262628] border-[2px] w-[60%] mx-auto">
                <div className="max-w-3xl mx-auto flex">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask me anything…"
                        className="flex-1 p-2 focus:outline-none text-[16px] text-[#F2F2F2]"
                        disabled={disabled}
                    />
                    <button
                        type="submit"
                        className="bg-[transparent] disabled:opacity-50 submit-button"
                        disabled={disabled || !input.trim()}
                    >
                        {disabled ? <RiLoader2Fill className="text-[#F2F2F2] text-[20px]" /> : <Image src={sendIcon} alt="send icon" /> }
                    </button>
                </div>
            </form>
            <p className='p-2 border border-[#262628] border-[2px] border-t-[0px] w-[60%] mx-auto text-[14px] text-[#999999] text-center'>Prompt Suite can make mistakes. so double-check it</p>
        </>
    );
}