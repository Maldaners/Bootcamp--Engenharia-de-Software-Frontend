import React, { InputHTMLAttributes, forwardRef } from 'react';

type CheckBoxProps = InputHTMLAttributes<HTMLInputElement> & {
    text: string;
    helperText?: string;
    error?: boolean;
};

const CheckBox = forwardRef<HTMLInputElement, CheckBoxProps>(
    ({ text, error, helperText = "", ...props }, ref) => {

        return (
            <div>
                <div className="flex items-center">
                    <input {...props} ref={ref} type="checkbox" className="form-checkbox text-blue-500  w-6 h-6" />
                    <label htmlFor={props.id} className="ml-2">{text}</label>
                </div>
                {error && <span className="text-error text-sm">{helperText}</span>}
            </div>
        );
    }
);

export default CheckBox