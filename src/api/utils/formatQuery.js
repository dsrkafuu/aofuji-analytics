/**
 * format query type
 * @param {string} type string or number
 * @param {string|number|undefined} value
 */
function formatQuery(type, value) {
  if (value === undefined || value === null) {
    return undefined;
  }
  switch (type) {
    case 'string':
      return typeof value === 'string' ? value : String(value);
    case 'number':
      return typeof value === 'number' ? value : Number(value);
    default:
      return undefined;
  }
}

module.exports = { formatQuery };
