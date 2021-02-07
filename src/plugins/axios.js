import axios from 'axios';

// api
let baseURL = process.env.VUE_APP_BASE_URL || '/';
if (!baseURL.endsWith('/')) {
  baseURL += '/';
}
const api = axios.create({
  baseURL: `${baseURL}api`,
  withCredentials: true,
});
api.interceptors.request.use((req) => {
  const url = new URL(req.url, 'https://example.org');
  // no cache check
  if (url.searchParams.has('cache') && `${url.searchParams.get('cache')}` === '0') {
    req.headers['Cache-Control'] = 'no-cache';
    req.headers['Pragma'] = 'no-cache';
  }
  return req;
});

// axios
const xhr = axios.create();

export default {
  /**
   * @param {Vue} Vue
   */
  install(Vue) {
    Vue.prototype.$api = api;
    Vue.prototype.$axios = xhr;
  },
};
