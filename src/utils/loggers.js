/**
 * @param {String} info
 * @param {...any} params
 */
export function logInfo(info, ...params) {
  console.info('[vector-analytics]', info, ...params);
}

/**
 * @param {Error|String} err
 * @param {...any} params
 */
export function logError(err, ...params) {
  console.error('[vector-analytics]', err, ...params);
}
