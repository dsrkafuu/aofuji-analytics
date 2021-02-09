/**
 * convert array contains objects with `_id` and `value` to [[_id, value]]
 * @param {Array{Object}} arr
 * @return {Array}
 */
function toPairs(arr) {
  if (!arr.length) {
    return [];
  }
  if (arr[0]._id === undefined && arr[0].value === undefined) {
    return [];
  }
  return arr.map((item) => [item._id, item.value]);
}

module.exports = { toPairs };
