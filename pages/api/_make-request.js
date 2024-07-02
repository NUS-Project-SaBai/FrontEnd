import axios from "axios";
import Router from "next/router";

/**
 * A higher-order function for making HTTP requests.
 *
 * @param {string} method - The HTTP method ('get', 'post', 'delete').
 * @param {string} url - The full URL to the resource.
 * @param {Object} [data] - The data to be sent with the request (for POST).
 * @returns {Promise<Object>} The response data.
 */
export default async function makeRequest(
  method,
  url,
  data = null,
  additionalHeaders = {},
) {
  // Fetch the token and construct the config object
  const config = await fetch("/api/token")
    .then((res) => {
      if (!res.ok) {
        Router.push("/api/auth/login"); // gets new token
        throw new Error(`Failed to fetch token: ${res.statusText}`);
      }
      return res.json();
    })
    .then((token) => {
      // Construct the request config
      const config = {
        method,
        url,
        headers: {
          Authorization: `Bearer ${token}`, // Assuming the token is a bearer token
          ...additionalHeaders,
        },
      };

      if (
        (data && method.toLowerCase() === "post") ||
        method.toLowerCase() === "patch"
      ) {
        config.data = data;
      }

      return config;
    });

  // Make the request using axios
  const response = await axios(config);
  return response;
}
