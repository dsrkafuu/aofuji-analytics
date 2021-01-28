/* deps */
const isLocalhost = require('is-localhost-ip');

/**
 * format referrer
 * @param {string} ref referrer from `document.referrer`
 * @param {string} url website's full url
 * @return {string|undefined} hostname or undefined
 */
function formatRef(ref, url) {
  // if not full url, return undefined
  if (!/:\/\//gi.exec(ref)) {
    return undefined;
  }
  // if localhost, return undefined
  const refURL = new URL(ref);
  if (isLocalhost(refURL.hostname)) {
    return undefined;
  }
  // if samesite, return undefined
  const siteURL = new URL(url);
  if (refURL.hostname === siteURL.hostname) {
    return undefined;
  }
  // return hostname
  return refURL.hostname || undefined;
}

module.exports = { formatRef };
