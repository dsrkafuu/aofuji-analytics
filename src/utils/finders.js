/**
 * find an object's index in an array
 * @param {Array} array
 * @param {string} key
 * @param {any} value
 * @return {number}
 */
export function findObjectIndexInArray(array, key, value) {
  if (!Array.isArray(array)) {
    return NaN;
  }
  let index = NaN;
  for (let i = 0; i < array.length; i++) {
    if (array[i][key] === value) {
      index = i;
      break;
    }
  }
  return index;
}
