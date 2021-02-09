/**
 * format query type
 * @param {'string'|'number'} type string or number
 * @param {string|number|undefined} value
 */
function formatQuery(type, value) {
  switch (type) {
    case 'string':
      return typeof value === 'string' ? value : String(value);
    case 'number':
      return typeof value === 'number' ? value : Number(value);
  }
}

module.exports = { formatQuery };
