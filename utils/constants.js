export const API_URL = 'http://localhost:8000';
export const CLOUDINARY_URL = 'https://res.cloudinary.com/dlusodadw';

export const venueOptions = {
  PC: 'PC',
  CA: 'CA',
  TT: 'TT',
  TK: 'TK',
  SV: 'Smong',
};

export const venueColours = {
  PC: '#6D8A91',  // Even darker pastel blue
  CA: '#CC7685',  // Even darker pastel pink
  TT: '#7A7A70',  // Even darker pastel gray
  TK: '#CCCC45',  // Even darker pastel yellow
  SV: '#6A516D',  // Even darker pastel purple
};

export const styles = {
  venue: {
    PC: { color: venueColours.PC },
    CA: { color: venueColours.CA },
    TT: { color: venueColours.TT },
    TK: { color: venueColours.TK },
    SV: { color: venueColours.SV },
  },
};

export const NO_PHOTO_MESSAGE = 'Please take a photo before submitting!';
export const NO_MATCHES_FOUND_MESSAGE = 'No matches found!';
export const MATCH_FOUND_MESSAGE = 'Match found!';
