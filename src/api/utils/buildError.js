/**
 * build a custom error
 * @param {number} status
 * @param {string} statusText
 * @return {Error}
 */
module.exports = (status, statusText) => {
  const err = new Error(statusText);
  err.status = status;
  return err;
};
