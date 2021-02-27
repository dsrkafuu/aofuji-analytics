/**
 * custom select for `create()`
 * @param {Object} result mongoose document
 * @param {string} keys
 */
function selectQuery(result, keys) {
  let ret = result;
  ret.toObject && (ret = ret.toObject());
  keys = ['_id', ...(keys.split(' ') || [])];
  for (let key in ret) {
    if (!keys.includes(key)) {
      delete ret[key];
    }
  }
  return ret;
}

module.exports = selectQuery;
