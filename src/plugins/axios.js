import Vue from 'vue';
import axios from 'axios';

export default {
  /**
   * installer for `Vue.use()`
   */
  install() {
    // setting base url
    const axiosInst = axios.create({
      baseURL: `${process.env.NODE_ENV === 'production' ? process.env.BASE_URL || '/' : '/'}api`,
    });

    // add global axios
    Vue.prototype.$axios = axiosInst;
  },
};
