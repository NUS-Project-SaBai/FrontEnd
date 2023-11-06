# Project SaBai Front-End

## Installation

1. Installation of Node Version Manager

   - Refer to the GitHub on how to install [node version manager (GitHub)](https://github.com/nvm-sh/nvm)
   - `nvm install node` to install the latest version of node.js
   - Verify that you have installed node correctly `node -v`
   - Verify that you have `npm` by typing in `npm -v`

2. Installation of yarn
   [https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable]

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

## Technology used

1. Node Version Manager [https://github.com/nvm-sh/nvm]
2. Node.js [https://nodejs.org/en]
3. Node Package Manager [https://www.npmjs.com/]
4. Yarn [https://yarnpkg.com/]
5. React.js [https://react.dev/]
6. Next.js [https://nextjs.org/]
7. SASS [https://sass-lang.com/]
8. Axios [https://axios-http.com/docs/intro]

<!-- # Example app utilizing cookie-based authentication

## How to use

### Using `create-next-app`

Download [`create-next-app`](https://github.com/segmentio/create-next-app) to bootstrap the example:

````

npm i -g create-next-app
create-next-app --example with-cookie-auth with-cookie-auth-app

````

### Download manually

Download the example [or clone the repo](https://github.com/zeit/next.js):

```bash
curl https://codeload.github.com/zeit/next.js/tar.gz/canary | tar -xz --strip=2 next.js-canary/examples/with-cookie-auth
cd with-cookie-auth
````

### Run locally

After you clone the repository you can install the dependencies, run `yarn dev` and start hacking! You'll be able to see the application running locally as if it were deployed.

```bash
$ cd with-cookie-auth
$ (with-cookie-auth/) yarn install
$ (with-cookie-auth/) yarn dev
```

### Deploy

Deploy it to the cloud with [now](https://zeit.co/now) ([download](https://zeit.co/download))

```bash
now
```

## The idea behind the example

In this example, we authenticate users and store a token in a cookie. The example only shows how the user session works, keeping a user logged in between pages.

This example is backend agnostic and uses [isomorphic-unfetch](https://www.npmjs.com/package/isomorphic-unfetch) to do the API calls on the client and the server.

The repo includes a minimal passwordless backend built with the new [API Routes support](https://github.com/zeit/next.js/pull/7296) (`pages/api`), [Micro](https://www.npmjs.com/package/micro) and the [GitHub API](https://developer.github.com/v3/). The backend allows the user to log in with their GitHub username.

Session is synchronized across tabs. If you logout your session gets removed on all the windows as well. We use the HOC `withAuthSync` for this.

The helper function `auth` helps to retrieve the token across pages and redirects the user if not token was found. -->
