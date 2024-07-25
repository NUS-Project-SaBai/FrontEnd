import React, { useRef, useEffect } from 'react';

export function InputBox({ name, label, type, value, onChange, placeholder }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-900 mt-4"
      >
        {label}
      </label>
      <div className="">
        <textarea
          rows={4}
          id={name}
          placeholder={placeholder}
          name={name}
          type={type}
          onChange={onChange}
          value={value}
          ref={textareaRef}
          required
          className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </div>
    </div>
  );
}
