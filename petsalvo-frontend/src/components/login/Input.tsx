import React, { InputHTMLAttributes, forwardRef } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    helperText?: string;
    error?: boolean;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ error, helperText = "", ...props }, ref) => {
        return (
            <div>
                <input ref={ref} {...props} className="w-full px-3 py-2 border border-black rounded-md" />
                {error && <span className="text-error text-sm">{helperText}</span>}
            </div>
        );
    }
);

export default Input