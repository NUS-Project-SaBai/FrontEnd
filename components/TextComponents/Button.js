import React, { useState } from "react";

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
      {isLoading?"Loading...":text}
    </button>
  );
}
/*
Comments are for tailwind to recognise the colours
bg-indigo-800
hover:bg-indigo-500
focus-visible:outline-indigo-600

bg-sky-800
hover:bg-sky-500
focus-visible:outline-sky-600

bg-blue-800
hover:bg-blue-500
focus-visible:outline-blue-600

bg-green-800
hover:bg-green-500
focus-visible:outline-green-600

bg-red-800
hover:bg-red-500
focus-visible:outline-red-600

bg-orange-800
hover:bg-orange-500
focus-visible:outline-orange-600
*/
