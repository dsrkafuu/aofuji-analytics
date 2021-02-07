/* deps */
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
/* modules */
import { THEME } from './theme.js';
import { COMMON } from './common.js';
import { MESSAGE } from './message.js';
import { WEBSITE } from './website.js';

export const store = new Vuex.Store({
  modules: {
    THEME,
    COMMON,
    MESSAGE,
    WEBSITE,
  },
});
