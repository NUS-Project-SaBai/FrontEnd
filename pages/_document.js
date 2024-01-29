import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" style={{ overflowY: "hidden" }}>
      <Head></Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
