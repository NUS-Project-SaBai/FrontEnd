# Frontend setup

1. Installation of Node Version Manager

   - For Mac/Linux: Refer to the GitHub on how to install [node version manager (GitHub)](https://github.com/nvm-sh/nvm)
   - For Windows: Refer to the Github [nvm-windows (Github)](https://github.com/coreybutler/nvm-windows/releases) and download nvm-setup.exe under "Assets"

2. At the time of writing, Project Sabai no longer works with the latest version of `node.js`. Instead, the latest working version seems to be `24.11.0`. If not, use `20.17.0` as specified in [package.json](package.json).

   ```bash
   # Install the latest version of node.js
   nvm install 24.11.0
   # Verify that you have installed node correctly
   node -v
   # Verify npm is installed
   npm -v
   ```

3. Installation of pnpm <https://pnpm.io/installation>:

   Next, install pnpm:

   ```bash
   # Installing pnpm
   npm install -g pnpm
   # Verify installation
   pnpm --version

   ```

4. Environmental Setup

   Create a new `.env` and fill it with relevant details under the "FRONTEND" heading in the _"Key Credentials"_ document.

5. Installation of project libraries

   Note: If you are converting from yarn to pnpm, you will need to delete the existing `node_modules` folder.

   ```bash
   # Install the necessary libraries for the project
   pnpm i
   # Run the development server. Ensure backend server is already running
   pnpm dev
   ```

   \*Make sure you set up both the Frontend AND Backend before logging into localhost.

   Log into localhost with the credentials in the "Key Credentials" document.

# Technology used

1. Node Version Manager [https://github.com/nvm-sh/nvm]
2. Node.js [https://nodejs.org/en]
3. Node Package Manager [https://www.npmjs.com/]
4. pnpm [https://pnpm.io/]
5. React.js [https://react.dev/]
6. Next.js [https://nextjs.org/]
7. Axios [https://axios-http.com/docs/intro]
8. Auth0 [https://auth0.com/]
