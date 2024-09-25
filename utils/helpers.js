import { CLOUDINARY_URL, defaultAPI_URL, OFFLINE } from './constants';

// convert base64 url screenshot to file
export function urltoFile(url, filename, mimeType) {
  return fetch(url)
    .then(function (res) {
      return res.arrayBuffer();
    })
    .then(function (buf) {
      return new File([buf], filename, { type: mimeType });
    });
}

/**
 * This function returns the relevant image url based on whether it is offline.
 *
 * @param {pictureData} data - must contain either `.offline_picture` or `.picture`
 * @return {String} the image url
 *
 * @typedef {Object} pictureData
 * @property {String|null} data.offline_picture
 * @property {String|null} data.picture
 */
export function getImageUrl(data) {
  if (data.offline_picture == null && data.picture == null) {
    console.error(
      `Invalid data is passed.
      Attribute 'offline_picture'/'picture' are both null.
      Data is:\n`,
      data
    );
  }
  return OFFLINE
    ? `${defaultAPI_URL}/${data.offline_picture}`
    : `${CLOUDINARY_URL}/${data.picture}`;
}
