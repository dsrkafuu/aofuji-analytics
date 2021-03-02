/**
 * @param {String} info
 * @param {...any} params
 */
export function logInfo(info, ...params) {
  console.info('[aofuji]', info, ...params);
}

/**
 * @param {Error|String} err
 * @param {...any} params
 */
export function logError(err, ...params) {
  console.error('[aofuji]', err, ...params);
}
