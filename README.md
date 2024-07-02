# Project SaBai Front-End

## Installation

1. Installation of Node Version Manager

   - Refer to the GitHub on how to install [node version manager (GitHub)](https://github.com/nvm-sh/nvm)
   - `nvm install node` to install the latest version of node.js
   - Verify that you have installed node correctly `node -v`
   - Verify that you have `npm` by typing in `npm -v`

2. Installation of yarn <https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable>

   Next, install Yarn package manager by following the instructions provided on their website.
   After installing Yarn, verify the installation with the following command:

   ```bash
   # Installing yarn
   npm install --global yarn
   # Verify installation
   yarn -- version
   ```

3. Installation of project libraries

   ```bash
   git clone https://github.com/NUS-Project-SaBai/FrontEnd
   # Change Directory into the FrontEnd folder
   cd FrontEnd
   # Install the necessary libraries for the project
   yarn install
   # Run the development server
   yarn dev
   ```

4. Configure Local Backend

   In the FrontEnd/utils/constants.js file, ensure that you are using the local backend instead of the actual backend. Comment out the first line and uncomment the last line, as shown below:

   ```bash
   // export const API_URL = "https://projectsabai-vza8.onrender.com";
   export const CLOUDINARY_URL = "https://res.cloudinary.com/dxy0byphl";
   export const API_URL = "http://localhost:8000";
   ```

5. Environmental Setup
   Create a `.env.local` by making a copy of `.env.local.example` and filling it with relevant details from the "Key Credentials" document.

   ```bash
   # Run the following command to start the server:
   yarn dev
   ```

   Login with the credentials in the key credential file.

## Technology used

1. Node Version Manager [https://github.com/nvm-sh/nvm]
2. Node.js [https://nodejs.org/en]
3. Node Package Manager [https://www.npmjs.com/]
4. Yarn [https://yarnpkg.com/]
5. React.js [https://react.dev/]
6. Next.js [https://nextjs.org/]
7. SASS [https://sass-lang.com/]
8. Axios [https://axios-http.com/docs/intro]
9. Auth0 [https://auth0.com/]
