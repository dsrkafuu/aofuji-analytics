import { logError } from './logger.js';

/**
 * @param {string} key
 */
export const getLS = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (e) {
    logError(e);
    return null;
  }
};

/**
 * @param {string} key
 * @param {any} value
 */
export const setLS = (key, value) => {
  try {
    return localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    logError(e);
  }
};
