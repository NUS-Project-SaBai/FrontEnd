import React, { useState } from "react";
import axios from "axios";

const APIComponent = ({
  method,
  apiUrl,
  defaultInput,
  primaryKey,
  foreignKey,
}) => {
  const [data, setData] = useState(defaultInput || {});
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e, key) => {
    setData({ ...data, [key]: e.target.value });
  };

  const handleRequest = async () => {
    try {
      let res;
      switch (method.toLowerCase()) {
        case "get":
          res = await axios.get(apiUrl);
          break;
        case "post":
          res = await axios.post(apiUrl, data);
          break;
        case "patch":
          res = await axios.patch(apiUrl, data);
          break;
        case "delete":
          res = await axios.delete(apiUrl);
          break;
        default:
          throw new Error("Invalid HTTP method");
      }
      setResponse(res.data);
      setError(null); // Clear any existing error message on successful response
    } catch (err) {
      if (err.response && err.response.data) {
        // Get the error message from the backend
        let errorMessage =
          err.response.data.message || JSON.stringify(err.response.data);
        // Add new lines after each comma for better readability
        errorMessage = errorMessage.split(",").join(",\n");
        setError(errorMessage);
      } else {
        // Fallback to generic error message
        setError(err.message);
      }
    }
  };

  const renderPayloadInputs = () => {
    if (!data || typeof data !== "object") return null;
    return Object.keys(data).map((key) => (
      <div key={key} className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">
          {key}:
          <input
            type="text"
            value={data[key]}
            onChange={(e) => handleChange(e, key)}
            className="w-full mt-2 p-2 border border-gray-300 rounded-md"
          />
        </label>
      </div>
    ));
  };

  const renderKeyInputs = () => {
    const keys = { ...primaryKey, ...foreignKey };
    return Object.keys(keys).map((key) => (
      <div key={key} className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">
          {key}:
          <input
            type="text"
            value={data[key] || keys[key]}
            onChange={(e) => handleChange(e, key)}
            className="w-full mt-2 p-2 border border-gray-300 rounded-md"
          />
        </label>
      </div>
    ));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h3 className="text-lg font-bold mb-4">API Request Component</h3>
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">
          URL:
          <input
            type="text"
            value={apiUrl}
            readOnly
            className="w-full mt-2 p-2 border border-gray-300 rounded-md"
          />
        </label>
      </div>
      {renderKeyInputs()} {/* Render primaryKey and foreignKey inputs */}
      {["post", "patch"].includes(method.toLowerCase()) && (
        <div className="mb-4">
          <h4 className="text-md font-semibold mb-2">Payload</h4>
          {renderPayloadInputs()} {/* Render payload inputs */}
        </div>
      )}
      <button
        onClick={handleRequest}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Send {method.toUpperCase()} Request
      </button>
      <div className="mt-6">
        <h4 className="text-md font-semibold mb-2">Response</h4>
        <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
          {response && JSON.stringify(response, null, 2)}
        </pre>
      </div>
      {error && (
        <div className="mt-6">
          <h4 className="text-md font-semibold mb-2 text-red-500">Error</h4>
          <pre className="bg-red-100 p-4 rounded-md overflow-auto">{error}</pre>
        </div>
      )}
    </div>
  );
};

export default APIComponent;
