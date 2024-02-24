import React, { ButtonHTMLAttributes } from 'react';

interface BotaoProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    text: string;
}

const BotaoTerciario: React.FC<BotaoProps> = ({ text, className, ...props }) => {
    className = `border border-black bg-gray-variant rounded-md px-3 py-4 hover:scale-105 hover:transition-transform duration-300 ${className}`;
    return (
        <button {...props} className={className}>{text}</button>
    );
}

export default BotaoTerciario