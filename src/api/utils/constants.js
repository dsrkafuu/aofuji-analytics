// sync with '@/utils/constants.js'

// dom
module.exports.DOM_ATTR_THEME = 'data-theme';

// cookie
module.exports.COOKIE_TOKEN = 'aofuji_token';

// storage
module.exports.STORAGE_THEME = 'aofuji_theme';
module.exports.STORAGE_ACCOUNT = 'aofuji_account';
module.exports.STORAGE_TOPOJSON = 'aofuji_topojson';

// api
module.exports.VIEW_EXPIRE_TIME = 10 * 60 * 1000; // 10 minutes
module.exports.SESSION_EXPIRE_TIME = 24 * 60 * 60 * 1000; // 1 day
module.exports.JWT_DEFAULT_SECRET = 'aofuji_token-secret';

// charts
module.exports.CHART_PIXEL_RATIO = 2;
module.exports.CHART_MAP_PIXEL_RATIO = 3;
module.exports.CHART_MAP_TOPOJSON =
  'https://cdn.jsdelivr.net/gh/amzrk2/dsr-cdn@1.1/json/world-110m.min.json';
