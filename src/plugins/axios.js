import axios from 'axios';

// setting base url
const axiosInst = axios.create({
  baseURL: `${process.env.NODE_ENV === 'production' ? process.env.BASE_URL || '/' : '/'}api`,
  withCredentials: true,
});

// interceptors
axiosInst.interceptors.request.use((req) => {
  // search param check
  const url = new URL(req.url, 'https://example.org');
  // no cache set
  if (url.searchParams.has('cache') && `${url.searchParams.get('cache')}` === '0') {
    req.headers['Cache-Control'] = 'no-cache';
    req.headers['Pragma'] = 'no-cache';
  }
  return req;
});

export default {
  /**
   * @param {Vue} Vue
   */
  install(Vue) {
    Vue.prototype.$axios = axiosInst;
  },
};
