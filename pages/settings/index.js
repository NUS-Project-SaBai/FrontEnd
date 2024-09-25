import toast from 'react-hot-toast';
import { useState } from 'react';
import { getAPI_URL, changeAPI_URL } from '@/utils/constants';
import { PageTitle } from '@/components/TextComponents';
import { DebugCard } from '@/components/debug';

const ChangeBackendURLForm = (props) => {

  return (
    <form onSubmit={props.handleSubmit}>
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
          defaultValue={props.backendURL}
          onChange={e => props.setBackendURL(e.target.value)}
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
  );
};

function SettingsPage() {
  const [backendURL, setBackendURL] = useState(getAPI_URL());

  const handleSubmit = async e => {
    e.preventDefault();
    changeAPI_URL(backendURL == '' ? getAPI_URL() : backendURL);
    setBackendURL(getAPI_URL());
    toast.success(`Backend URL is now: ` + getAPI_URL());
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center px-2">
      <PageTitle
        title="Settings Page"
        desc="Use this page to change the backend URL."
      />

      <DebugCard>
        <h2 className="text-xl font-semibold">Configuring Backend URL</h2>
        <ChangeBackendURLForm backendURL={backendURL} initialURL={getAPI_URL()} setBackendURL={setBackendURL} handleSubmit={handleSubmit}/>
      </DebugCard>

      <DebugCard>
        <h2 className="text-xl font-semibold">Download Data from Database</h2>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md mt-4 hover:bg-blue-600"
        >
          Download .csv File
        </button>
      </DebugCard>
    </div>
  );
}

export default SettingsPage;
