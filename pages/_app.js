import React, { useEffect } from "react";
import Layout from "../components/layout";
import { transitions, positions, Provider as AlertProvider } from "react-alert";

import "../styles/globals.css";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { Toaster } from "react-hot-toast";

const options = {
  position: positions.BOTTOM_CENTER,
  timeout: 5000,
  offset: "30px",
  transition: transitions.SCALE,
};

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Add any side effects here, similar to componentDidMount
    // You can manage cookies or perform other actions if needed
  }, []);

  return (
    <UserProvider>
      <Layout>
        <Component {...pageProps} />
        <Toaster position="top center" duration={4000} />
      </Layout>
    </UserProvider>
  );
}

// Add an event listener to the document
document.addEventListener(
  "wheel",
  function (event) {
    // Check if the target element is a number input
    if (event.target.type === "number") {
      // Prevent the default scrolling behavior
      event.preventDefault();
    }
  },
  { passive: false },
); // Ensure that the listener is not passive

export default MyApp;
