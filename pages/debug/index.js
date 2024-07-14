import APIComponent from './_components/APIComponent';
import { useState } from 'react';

const paths = [
  '/patients',
  '/visits',
  '/consults',
  '/diagnosis',
  '/medications',
  '/orders',
];

export default function DebuggingPage() {
  const [baseURL, setBaseURL] = useState('http://127.0.0.1:8000');

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <header className="w-full max-w-3xl mb-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          API Debugging Tool
        </h1>
        <p className="text-center text-gray-600 mt-2">
          Use this tool to test and debug your API endpoints.
        </p>
      </header>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-3xl mb-6">
        <label
          htmlFor="baseURL"
          className="block text-sm font-medium text-gray-700"
        >
          Set Base URL:
        </label>
        <input
          type="text"
          id="baseURL"
          value={baseURL}
          onChange={(e) => setBaseURL(e.target.value)}
          className="mt-1 p-2 border border-gray-300 rounded-md w-full"
        />
      </div>
      <div className="grid grid-cols-1 gap-6 w-full max-w-3xl">
        {paths.map((path) => (
          <APIComponent key={path} baseURL={baseURL} path={path} />
        ))}
      </div>
    </div>
  );
}