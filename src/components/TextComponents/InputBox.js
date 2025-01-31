import React, { useRef, useEffect } from 'react';

export function InputBox({ name, label, value, onChange, placeholder }) {
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
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
      </label>
      <div className="mt-1 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-400">
        <textarea
          rows={4}
          id={name}
          placeholder={placeholder}
          name={name}
          onChange={onChange}
          value={value || ''}
          ref={textareaRef}
          required
          className="flex-1 block w-full rounded-md border-2 py-1.5 px-1.5 bg-white text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm sm:leading-6"
        />
      </div>
    </div>
  );
}
