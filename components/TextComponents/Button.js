import React, { useState } from 'react';

export function Button({ text, onClick, colour }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    try {
      setIsLoading(true);
      await onClick();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className={`rounded-md bg-${colour}-800 px-2.5 py-1.5 text-s font-semibold text-white shadow-sm hover:bg-${colour}-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-${colour}-600`}
      onClick={handleClick}
      disabled={isLoading}
    >
      {text}
    </button>
  );
}
