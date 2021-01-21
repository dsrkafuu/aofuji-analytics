import axios from 'axios';
import store from '../store';

export default {
  /**
   * install axios
   */
  install(Vue) {
    // setting base url
    const axiosInst = axios.create({
      baseURL: `${process.env.NODE_ENV === 'production' ? process.env.BASE_URL || '/' : '/'}api`,
    });

    // interceptors
    axiosInst.interceptors.request.use(
      (req) => req,
      (e) => {
        store.dispatch('TRIGGER_MESSAGE', {
          type: 'error',
          text: `request error ${e.response.status}`,
        });
        return Promise.reject(e);
      }
    );
    axiosInst.interceptors.response.use(
      (res) => res,
      (e) => {
        store.dispatch('TRIGGER_MESSAGE', {
          type: 'error',
          text: `response error ${e.response.status}`,
        });
        return Promise.reject(e);
      }
    );

    // add global axios
    Vue.prototype.$axios = axiosInst;
  },
};
