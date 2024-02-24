import { ButtonHTMLAttributes } from "react";

interface BotaoProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
}

export default function BotaoConfirmar({ text, ...props }: BotaoProps) {
  return (
    <button
      className="bg-indigo-300 text-gray-950 rounded-md border-2 border-gray-700 p-2 w-full hover:scale-105 hover:transition-transform duration-300"
      {...props}
    >
      {text}
    </button>
  );
}
