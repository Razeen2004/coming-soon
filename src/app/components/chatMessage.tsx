import { Message } from '../types/index';

interface ChatMessageProps {
    message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
    return (
        <div className='flex justify-center items-center my-2 px-[25%]'>
            <div
                className={` overflow-hidden rounded-lg text-[16px] my-[10px] text-[#F2F2F2] ${message.role === 'user' ? 'bg-[#26262C] text-right p-4 ml-auto' : 'mr-auto bg-[transparent] text-left'
                    }`}
            >
                <div className="font-bold">{message.role === 'user' ? '' : ''}</div>
                <div>{message.content}</div>
            </div>
        </div>
    );
}