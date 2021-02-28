// sync with '@/utils/constants.js'

// dom
module.exports.DOM_ATTR_THEME = 'data-theme';

// cookie
module.exports.COOKIE_TOKEN = 'vec_token';

// storage
module.exports.LS_KEY = 'vec_data';
module.exports.STORAGE_THEME = 'theme';
module.exports.STORAGE_ACCOUNT = 'account';

// api
module.exports.VIEW_EXPIRE_TIME = 10 * 60 * 1000; // 10 minutes
module.exports.SESSION_EXPIRE_TIME = 24 * 60 * 60 * 1000; // 1 day
module.exports.JWT_DEFAULT_SECRET = 'vec_token-secret';

// charts
module.exports.CHART_PIXEL_RATIO = 2;
module.exports.CHART_MAP_PIXEL_RATIO = 3;
module.exports.CHART_MAP_TOPOJSON =
  'https://cdn.jsdelivr.net/gh/amzrk2/dsr-cdn@1.1/json/world-110m.min.json';
