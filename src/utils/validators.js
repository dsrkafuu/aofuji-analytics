/**
 * @param {string} string
 * @return {boolean}
 */
export function validUsername(string) {
  if (string.length > 10) {
    return false;
  }
  return Boolean(/^[a-z0-9-_]*$/gi.exec(string));
}

/**
 * @param {string} string
 * @return {boolean}
 */
export function validPassword(string) {
  if (string.length > 20) {
    return false;
  }
  return Boolean(/^[a-z0-9-_.]*$/gi.exec(string));
}
