// export const API_URL = "https://projectsabai-vza8.onrender.com";

export const CLOUDINARY_URL = 'https://res.cloudinary.com/dlusodadw';

export const defaultAPI_URL = process.env.API_URL || 'http://localhost:8000';

const windowCheck = typeof window === "undefined";

export const getAPI_URL = () => (!windowCheck)
  ? window.localStorage.getItem('API_URL')
  : defaultAPI_URL;

export const changeAPI_URL = (newURL) => {
  window.localStorage.setItem('API_URL', newURL);
}

export const venueOptions = {
  PC: 'PC',
  CA: 'CA',
  TT: 'TT',
  TK: 'TK',
  SV: 'Smong',
};

export const NO_PHOTO_MESSAGE = 'Please take a photo before submitting!';
export const NO_MATCHES_FOUND_MESSAGE = 'No matches found!';
export const MATCH_FOUND_MESSAGE = 'Match found!';
