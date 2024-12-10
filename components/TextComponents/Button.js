import React, { useState } from 'react';

export function Button({ text, onClick, colour, textColour, outlineColour }) {
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
      className={`rounded-md bg-${colour}-500 px-2.5 py-1.5 text-s font-semibold text-${textColour ?? 'white'} shadow-sm hover:bg-${colour}-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-${colour}-600 outline outline-${outlineColour}`}
      onClick={handleClick}
      disabled={isLoading}
    >
      {text}
    </button>
  );
}
