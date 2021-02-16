import { logError } from './loggers.js';
import { LS_KEY } from './constants.js';

/**
 * set local storage
 * @param {string} key
 */
export function setLS(key, value) {
  try {
    const data = JSON.parse(localStorage.getItem(LS_KEY)) || {};
    data[key] = value;
    localStorage.setItem(LS_KEY, JSON.stringify(data));
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
    const data = JSON.parse(localStorage.getItem(LS_KEY)) || {};
    return data[key];
  } catch (e) {
    logError(e);
    return null;
  }
}
