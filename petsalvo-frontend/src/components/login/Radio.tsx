import React, { InputHTMLAttributes, forwardRef } from 'react';

type RadioProps = InputHTMLAttributes<HTMLInputElement> & {
    text: string;
    error?: boolean;
};

const Radio = forwardRef<HTMLInputElement, RadioProps>(
    ({ text, error, ...props }, ref) => {
        
        const classNameLabel = `w-full pt-1 pb-1 ml-2 text-sm${error ? ' text-error' : ''}`;

        return (
            <div className="select-none flex items-center pl-4 border border-gray-300 rounded p-1 hover:scale-105 hover:transition-transform duration-300">
                <input {...props} ref={ref} type="radio" className="w-4 h-4" />
                <label htmlFor={props.id} className={classNameLabel}>{text}</label>
            </div>
        );
    }
);

export default Radio