import { useState, useEffect } from 'react';
import axiosInstance from '@/pages/api/_axiosInstance';

export function APIComponent({ baseURL, path }) {
  const [url, setUrl] = useState(baseURL + path);
  const [method, setMethod] = useState('GET');
  const [payload, setPayload] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setUrl(baseURL + path);
  }, [baseURL, path]);

  const handleSubmit = async e => {
    e.preventDefault();
    setResponse(null);
    setError(null);

    try {
      const options = {
        url,
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (method !== 'GET') {
        options.data = JSON.parse(payload);
      }

      let res;
      switch (method) {
        case 'GET':
          res = await axiosInstance.get(url, { headers: options.headers });
          break;
        case 'POST':
          res = await axiosInstance.post(url, options.data, {
            headers: options.headers,
          });
          break;
        case 'PUT':
          res = await axiosInstance.put(url, options.data, {
            headers: options.headers,
          });
          break;
        case 'DELETE':
          res = await axiosInstance.delete(url, { headers: options.headers });
          break;
        case 'PATCH':
          res = await axiosInstance.patch(url, options.data, {
            headers: options.headers,
          });
          break;
        default:
          throw new Error('Invalid HTTP method');
      }

      setResponse(res.data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className={`p-8 rounded-lg shadow-md w-full ${error ? 'bg-red-200' : 'bg-white'}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="url"
            className="block text-sm font-medium text-gray-700"
          >
            Backend URL:
          </label>
          <input
            type="text"
            id="url"
            name="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            required
          />
        </div>
        <div className="flex space-x-4 items-end">
          <div className="flex-grow">
            <label
              htmlFor="method"
              className="block text-sm font-medium text-gray-700"
            >
              HTTP Method:
            </label>
            <select
              id="method"
              name="method"
              value={method}
              onChange={e => setMethod(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              required
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
              <option value="PATCH">PATCH</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
        {method !== 'GET' && (
          <div>
            <label
              htmlFor="payload"
              className="block text-sm font-medium text-gray-700"
            >
              Payload (JSON):
            </label>
            <textarea
              id="payload"
              name="payload"
              rows="10"
              value={payload}
              onChange={e => setPayload(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              required
            />
          </div>
        )}
      </form>
      <h2 className="text-xl font-semibold mt-6">Response:</h2>
      <pre
        className={`p-4 border border-gray-300 rounded-md mt-2 w-full overflow-auto ${error ? 'bg-red-100' : 'bg-gray-100'}`}
      >
        {response
          ? JSON.stringify(response, null, 2)
          : error
            ? `Error: ${error}`
            : 'No response yet'}
      </pre>
    </div>
  );
}
