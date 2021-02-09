const sortBy = require('lodash/sortBy.js');

/**
 * generate times of certain value map from an array
 * returns same as `utils/toPairs.js`
 * @param {Array<Object>} arr
 * @param {string} key
 * @return {Array<Object>}
 */
function mapArray(arr, key) {
  if (!arr.length) {
    return [];
  }
  const map = new Map();
  arr.forEach((item) => {
    const _id = item[key];
    let obj = map.get(_id);
    if (obj) {
      obj[1]++;
    } else {
      obj = [_id, 1];
      map.set(_id, obj);
    }
  });
  // directly pass `map.values()` iterator
  // will lead to lodash error
  return sortBy([...map.values()], (obj) => obj[1]).reverse();
}

module.exports = { mapArray };
