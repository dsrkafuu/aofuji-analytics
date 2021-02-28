import axios from 'axios';

import { logInfo, logError } from '@/utils/loggers';
import { $error } from '@/plugins/message';

// interceptors
let qid = 1;

function requestConfigInterceptor(config) {
  // add no cache header
  const url = new URL(config.url, 'https://example.org');
  if (url.searchParams.has('cache') && `${url.searchParams.get('cache')}` === '0') {
    config.headers['Cache-Control'] = 'no-cache';
    config.headers['Pragma'] = 'no-cache';
  }
  // add id and request time
  config.id = qid++;
  config.time = Date.now();
  return config;
}

function responseInterceptor(res) {
  const config = res.config;
  const method = config.method.toUpperCase();
  const src = (config.baseURL || '') + config.url;
  const lag = res.headers['x-response-time'];
  logInfo(
    `#${config.id} -> ${method} ${src} (${res.status}) ${lag ? `[${lag}] ` : ''}| ${config.time}`
  );
  return res;
}

function responseErrorInterceptor(e) {
  const config = e.config;
  const method = config.method.toUpperCase();
  const src = (config.baseURL || '') + config.url;
  const status = e.response.status || 418;
  logError(`#${config.id} -> ${method} ${src} (${status})} | ${config.time}`);
  $error(`error response ${status}`);
}

// api
let baseURL = process.env.VUE_APP_BASE_URL || '/';
if (!baseURL.endsWith('/')) {
  baseURL += '/';
}
const api = axios.create({
  baseURL: `${baseURL}api`,
  withCredentials: true,
});
api.interceptors.request.use(requestConfigInterceptor);
api.interceptors.response.use(responseInterceptor, responseErrorInterceptor);

// axios
const xhr = axios.create();
xhr.interceptors.request.use(requestConfigInterceptor);
xhr.interceptors.response.use(responseInterceptor, responseErrorInterceptor);

export const $api = api;
export const $axios = xhr;

export default {
  install(Vue) {
    Vue.prototype.$api = $api;
    Vue.prototype.$axios = $axios;
  },
};
