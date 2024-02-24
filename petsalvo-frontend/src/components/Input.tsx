import React, { InputHTMLAttributes, forwardRef } from 'react';
import InputMask from 'react-input-mask';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    text: string;
    helperText?: string;
    error?: boolean;
    mask?: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ mask="", text, error, helperText = "", ...props }, ref) => {
        return (
            <div>
                <label htmlFor={props.id} className="block text-sm font-medium text-gray-700">
                    {text}
                </label>
                <InputMask mask={mask} inputRef={ref} {...props} className="w-full px-3 py-2 border border-black rounded-md focus:outline-none focus:ring focus:ring-indigo-200" />
                {error && <span className="text-error text-sm">{helperText}</span>}
            </div>
        );
    }
);

export default Input