/* vue */
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

/* modules */
import { THEME } from './theme.js';
import { MESSAGE } from './message.js';
import { USER } from './user.js';
import { WEBSITE } from './website.js';

export default new Vuex.Store({
  modules: {
    THEME,
    MESSAGE,
    USER,
    WEBSITE,
  },
});
