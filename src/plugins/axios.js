import Vue from 'vue';
import axios from 'axios';
import store from '../store';

export default {
  /**
   * installer for `Vue.use()`
   */
  install() {
    // setting base url
    const axiosInst = axios.create({
      baseURL: `${process.env.NODE_ENV === 'production' ? process.env.BASE_URL || '/' : '/'}api`,
    });

    // interceptors
    axiosInst.interceptors.response.use(
      (res) => res,
      (e) => {
        store.dispatch('TRIGGER_MESSAGE', {
          type: 'error',
          text: `request error ${e.response.status}`,
        });
        return null;
      }
    );

    // add global axios
    Vue.prototype.$axios = axiosInst;
  },
};
