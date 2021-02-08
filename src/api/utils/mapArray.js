/**
 * convert map/object to array
 * @param {Map|Object} map
 * @return {Array<Object>}
 */
function mapArray(map) {
  const arr = [];
  if (map instanceof Map) {
    map.forEach((value, key) => {
      arr.push({ key, value });
    });
  } else if (typeof map === 'object' && !map.forEach) {
    const keys = Object.keys(map);
    keys.forEach((key) => {
      arr.push({ key, value: map[key] });
    });
  }
  return arr;
}

module.exports = { mapArray };
