import React, { useState, InputHTMLAttributes, forwardRef } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    helperText?: string;
    error: boolean;
}

const InputSenha = forwardRef<HTMLInputElement, InputProps>(
    ({ error, helperText = "", ...props }, ref) => {
        const [showPassword, setShowPassword] = useState<boolean>(false);

        return (
            <div className="relative">
                <input ref={ref} {...props} type={showPassword ? 'text' : 'password'} className="w-full px-3 py-2 border border-black rounded-md" />
                {showPassword ? <AiOutlineEye className="absolute cursor-pointer top-3 right-3 select-none" onClick={() => setShowPassword(!showPassword)}/> : <AiOutlineEyeInvisible className="absolute cursor-pointer top-3 right-3 select-none" onClick={() => setShowPassword(!showPassword)}/>}
                {error && <span className="text-error text-sm">{helperText}</span>}
            </div>
        );
    }
);

export default InputSenha