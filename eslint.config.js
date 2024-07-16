import globals from 'globals';
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js';
import { fixupConfigRules } from '@eslint/compat';
import prettier from 'eslint-plugin-prettier';

export default [
  ...fixupConfigRules(pluginReactConfig),
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: globals.browser,
    },

    settings: {
      react: {
        version: 'detect', // Automatically detect the React version
      },
    },
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      indent: ['error', 2],
      'no-unused-vars': ['warn'],
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/display-name': 'off',
      'prettier/prettier': 'error', // Add Prettier rules
      'arrow-parens': 'off',
      'comma-dangle': 'off',
      'max-len': 'off',
      'no-mixed-operators': 'off',
      'no-tabs': 'off',
      'space-before-function-paren': 'off',
    },
    plugins: {
      prettier,
    },
  },
];
