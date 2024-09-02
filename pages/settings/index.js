import { useState } from 'react';
import { getAPI_URL, changeAPI_URL } from '@/utils/constants';
import { PageTitle } from '@/components/TextComponents';

function SettingsPage() {
  const [backendURL, setBackendURL] = useState(getAPI_URL());
  const [newURL, setNewURL] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    changeAPI_URL(newURL);
    setBackendURL(getAPI_URL());
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <PageTitle
        title="Settings Page"
        desc="Use this page to change the backend URL."
      />

      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-3xl mb-6">
        <h2 className="text-xl font-semibold">Configuring Backend URL</h2>

        <label className="block text-sm font-medium text-gray-700 mt-6">
          Current Backend URL:
        </label>
        <p className="bg-gray-100 p-4 border border-gray-300 rounded-md mt-2 w-full overflow-auto">
          {backendURL}
        </p>

        <form onSubmit={handleSubmit}>
          <label
            htmlFor="baseURL"
            className="block text-sm font-medium text-gray-700 mt-6"
          >
            Change Backend URL:
          </label>
          <div className="flex space-x-4 items-end">
            <input
              type="text"
              id="baseURL"
              defaultValue={backendURL}
              onChange={e => setNewURL(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-3xl mb-6">
        <h2 className="text-xl font-semibold">Download Data from Database</h2>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md mt-4 hover:bg-blue-600"
        >
          Download .csv File
        </button>
      </div>
    </div>
  );
}

export default SettingsPage;
