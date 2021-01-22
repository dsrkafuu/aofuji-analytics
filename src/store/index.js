/* vue */
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

/* modules */
import { THEME } from './theme.js';
import { MESSAGE } from './message.js';
import { SETTINGS } from './settings.js';

export default new Vuex.Store({
  modules: {
    THEME,
    MESSAGE,
    SETTINGS,
  },
});
