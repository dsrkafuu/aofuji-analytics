/**
 * build a custom error
 * @param {number} status
 * @param {string} statusText
 * @return {Error}
 */
function buildError(status, statusText) {
  const err = new Error(statusText);
  err.status = status;
  return err;
}

module.exports = { buildError };
