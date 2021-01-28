/**
 * format pathname
 * @param {string} path pathname starts with slash
 * @param {string} base base without trailing slash
 * @return {string} formated pathname without trailing slash
 */
function formatPath(path, base) {
  // format path
  if (!path.startsWith('/')) {
    path = `/${path}`;
  }
  // remove search params and anchors
  const url = new URL(path, 'https://example.org');
  path = url.pathname;
  // remove trailing slash
  const exp = /^(\/.*[^/])\/?$/i.exec(path);
  if (exp && exp[1]) {
    path = exp[1];
  } else {
    path = '/';
  }
  // remove base
  if (base !== '/') {
    path = path.split(base)[1] || '/';
  }
  return path;
}

module.exports = { formatPath };
