/**
 * @param {String} info
 * @param {...any} params
 */
export function logInfo(info, ...params) {
  console.info('[Goose Analytics]', info, ...params);
}

/**
 * @param {Error|String} err
 * @param {...any} params
 */
export function logError(err, ...params) {
  console.error('[Goose Analytics]', err, ...params);
}
