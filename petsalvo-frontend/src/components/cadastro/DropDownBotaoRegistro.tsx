import React, { useState, ReactNode } from 'react';
import { AiOutlineUp, AiOutlineDown } from "react-icons/ai"

interface DropDownBotaoRegistroProps {
    id: string;
    text: string
    children: ReactNode;
}

const DropDownBotaoRegistro: React.FC<DropDownBotaoRegistroProps> = ({ id, text, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative inline-block text-left">
            <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-black bg-[#CBF3F0] border border-black rounded-md"
                id={id}>
                {text}
                {isOpen ? <AiOutlineUp className="ml-2 h-5 w-5" /> : <AiOutlineDown className="ml-2 h-5 w-5" />}
            </button>

            {isOpen && (
                <>{children}</>
            )}
        </div>
    );
}

export default DropDownBotaoRegistro