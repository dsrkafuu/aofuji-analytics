import { logError } from './loggers';

/**
 * set local storage
 * @param {string} key
 * @param {any} value
 */
export function setLS(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    logError(e);
    return;
  }
}

/**
 * get local storage
 * @param {string} key
 * @return {any}
 */
export function getLS(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || null;
  } catch (e) {
    logError(e);
    return null;
  }
}
