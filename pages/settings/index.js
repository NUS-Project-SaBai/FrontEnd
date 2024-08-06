import  {useState} from 'react';
import { API_URL, changeAPI_URL } from '@/utils/constants';

function SettingsPage() {
    const [backendURL, setBackendURL] = useState(API_URL);
    const [newURL, setNewURL] = useState(backendURL);

    const handleSubmit = async (e) => {
        e.preventDefault();

        /*changeAPI_URL(newURL);
        setBackendURL(newURL);
        console.log(API_URL);
        */
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
            <header className="w-full max-w-3xl mb-6">
                <h1 className="text-3xl font-bold text-center text-gray-800">
                Settings Page
                </h1>
                <p className="text-center text-gray-600 mt-2">
                Use this page to change the backend URL.
                </p>
            </header>

            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-3xl mb-6">
                <h2 className="text-xl font-semibold">
                    Current Backend URL
                </h2>
                <p className="bg-gray-100 p-4 border border-gray-300 rounded-md mt-2 w-full overflow-auto">
                    {API_URL}
                </p>  
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-3xl mb-6">
                <form onSubmit={handleSubmit}>
                    <label
                    htmlFor="baseURL"
                    className="block text-sm font-medium text-gray-700"
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
        </div>
    );
}

export default SettingsPage;