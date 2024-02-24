import React, { ButtonHTMLAttributes } from 'react';
import { AiOutlineArrowLeft } from "react-icons/ai"

interface BotaoProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    text: string;
}

const BotaoVoltar: React.FC<BotaoProps> = ({ text, className, ...props }) => {
    className = `rounded-full border border-black bg-white flex items-center p-2 text-gray-600 hover:scale-105 hover:transition-transform duration-300 focus:outline-none ${className}`;
    return (
        <button {...props} className={className}>
            <AiOutlineArrowLeft />
            {text}
        </button>
    );
}

export default BotaoVoltar