# Project SaBai Front-End

## Installation

1. Installation of Node Version Manager

   - For Mac/Linux: Refer to the GitHub on how to install [node version manager (GitHub)](https://github.com/nvm-sh/nvm)
   - For Windows: Refer to the Github [nvm-windows (Github)](https://github.com/coreybutler/nvm-windows/releases) and download nvm-setup.exe under "Assets"
   - `nvm install node` to install the latest version of node.js
   - Verify that you have installed node correctly `node -v`
   - Verify that you have `npm` by typing in `npm -v`

2. Installation of pnpm <https://pnpm.io/installation>
   Next, install PNPM by following the following instructions:

   ```bash
   # Installing pnpm
   npm install -g pnpm
   # Verify installation
   pnpm --version
   ```

   Note: If you are converting from yarn to pnpm, then you will need to do the following

   1. Delete the current `node_modules`
   2. Run `pnpm i`

3. Installation of project libraries

   ```bash
   git clone https://github.com/NUS-Project-SaBai/FrontEnd
   # Change Directory into the FrontEnd folder
   cd FrontEnd
   # Install the necessary libraries for the project
   pnpm i
   # Run the development server
   pnpm dev
   ```

4. Environmental Setup

   Create a new `.env` and fill it with relevant details under the "FRONTEND" heading in the "Key Credentials" document.

   ```bash
   # Run the following command to start the server:
   pnpm dev
   ```

   \*Make sure you set up both the Frontend AND Backend before logging into localhost.

   Log into localhost with the credentials in the "Key Credentials" document.

## Technology used

1. Node Version Manager [https://github.com/nvm-sh/nvm]
2. Node.js [https://nodejs.org/en]
3. Node Package Manager [https://www.npmjs.com/]
4. pnpm [https://pnpm.io/]
5. React.js [https://react.dev/]
6. Next.js [https://nextjs.org/]
7. Axios [https://axios-http.com/docs/intro]
8. Auth0 [https://auth0.com/]
