import { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { debounce } from 'lodash';

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
            <form onSubmit={handleSubmit} className="p-4 border rounded-tl-md rounded-tr-md border-[#262628] w-[50%] mx-auto">
                <div className="max-w-3xl mx-auto flex">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask me anything…"
                        className="flex-1 p-2 focus:outline-none text-[14px] text-[#969699]"
                        disabled={disabled}
                    />
                    <button
                        type="submit"
                        className="bg-[transparent] disabled:opacity-50"
                        disabled={disabled || !input.trim()}
                    >
                        {disabled ? 'Sending...' : ""}
                    </button>
                </div>
            </form>
            <p className='p-2 border border-[#262628] w-[50%] mx-auto text-[14px] text-[#999999] text-center'>Prompt Suite can make mistakes. so double-check it</p>
        </>
    );
}