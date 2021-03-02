// sync with '@/api/utils/constants.js'

// dom
export const DOM_ATTR_THEME = 'data-theme';

// cookie
export const COOKIE_TOKEN = 'aofuji_token';

// storage
export const STORAGE_THEME = 'aofuji_theme';
export const STORAGE_ACCOUNT = 'aofuji_account';
export const STORAGE_TOPOJSON = 'aofuji_topojson';

// api
export const VIEW_EXPIRE_TIME = 10 * 60 * 1000; // 10 minutes
export const SESSION_EXPIRE_TIME = 24 * 60 * 60 * 1000; // 1 day
export const JWT_DEFAULT_SECRET = 'aofuji_token-secret';

// charts
export const CHART_PIXEL_RATIO = 2;
export const CHART_MAP_PIXEL_RATIO = 3;
export const CHART_MAP_TOPOJSON =
  'https://cdn.jsdelivr.net/gh/amzrk2/dsr-cdn@1.1/json/world-110m.min.json';
