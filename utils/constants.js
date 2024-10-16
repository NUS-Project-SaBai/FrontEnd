// export const API_URL = "https://projectsabai-vza8.onrender.com";

export const defaultAPI_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const isWindowUndefined = typeof window === 'undefined';

export const getAPI_URL = () => {
  if (isWindowUndefined) {
    return defaultAPI_URL;
  } else {
    if (window.localStorage.getItem('API_URL') === null) {
      window.localStorage.setItem('API_URL', defaultAPI_URL);
    }
    return window.localStorage.getItem('API_URL');
  }
};

export const changeAPI_URL = newURL => {
  window.localStorage.setItem('API_URL', newURL);
};

export const VENUE_OPTIONS = {
  PC: 'PC',
  CA: 'CA',
  TT: 'TT',
  TK: 'TK',
  SV: 'Smong',
};

export const OFFLINE = process.env.NEXT_PUBLIC_OFFLINE || false;

export const VILLAGE_COLOR_CLASSES = {
  PC: 'text-red-300 font-bold',
  CA: 'text-blue-300 font-bold',
  TT: 'text-green-300 font-bold',
  TK: 'text-yellow-300 font-bold',
  SV: 'text-purple-300 font-bold',
};
