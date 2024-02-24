import React, { TextareaHTMLAttributes, forwardRef, useState } from 'react';

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  text: string;
  helperText?: string;
  error?: boolean;
};

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ text, error, helperText = "", maxLength, ...props }, ref) => {
    const [charCount, setCharCount] = useState(0);

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const count = event.target.value.length;
      setCharCount(count);
    };

    return (
      <div>
        <label htmlFor={props.id} className="block text-sm font-medium text-gray-700">
          {text}
        </label>
        <textarea
          {...props}
          rows={8}
          ref={ref}
          onChange={handleChange}
          maxLength={maxLength}
          className="w-full px-3 py-2 border border-black rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
        />
        <div className="flex justify-end text-sm text-gray-500">
          {charCount}/{maxLength}
        </div>
        {error && <span className="text-error text-sm">{helperText}</span>}
      </div>
    );
  }
);

export default TextArea;
