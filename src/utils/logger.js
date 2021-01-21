/**
 * @param {String} info
 * @param {...any} params
 */
export function logInfo(info, ...params) {
  console.info('[goose analytics]', info, ...params);
}

/**
 * @param {Error|String} err
 * @param {...any} params
 */
export function logError(err, ...params) {
  console.error('[goose analytics]', err, ...params);
}
