// export const API_URL = "https://projectsabai-vza8.onrender.com";

export const CLOUDINARY_URL = 'https://res.cloudinary.com/dlusodadw';

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

export const venueOptions = {
  PC: 'PC',
  CA: 'CA',
  TT: 'TT',
  TK: 'TK',
  SV: 'Smong',
};

export const NO_MATCHES_FOUND_MESSAGE = 'No matches found!';
export const MATCH_FOUND_MESSAGE = 'Match found!';
