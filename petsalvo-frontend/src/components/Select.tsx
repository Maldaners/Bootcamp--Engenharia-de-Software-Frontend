import React, { SelectHTMLAttributes, forwardRef } from 'react';

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
    text: string;
    options: { key: number, value: string; text: string }[];
    helperText?: string;
    error?: boolean;
};

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ text, options, error, helperText = "", ...props }, ref) => {

        return (
            <div>
                <label htmlFor={props.id} className="block text-sm font-medium text-gray-700">
                    {text}
                </label>
                <select {...props} ref={ref} className="w-full px-3 py-2 border border-black rounded-md focus:outline-none focus:ring focus:ring-indigo-200">
                    <option value="0">Selecione</option>
                    {options.map((option) => (
                        <option key={option.key} value={option.value}>
                            {option.text}
                        </option>
                    ))}
                </select>
                {error && <span className="text-error text-sm">{helperText}</span>}
            </div>
        );
    }
);

export default Select;
