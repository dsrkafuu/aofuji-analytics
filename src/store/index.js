import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import { THEME_STORAGE_KEY, THEME_BODY_ATTR, THEMES } from '../utils/constants.js';
import { getLS, setLS } from '../utils/storage.js';

export default new Vuex.Store({
  state: {
    // init theme from `localStorage`
    theme: getLS(THEME_STORAGE_KEY) || THEMES.AUTO,
  },
  mutations: {
    UPDATE_THEME(state, payload) {
      const { newTheme } = payload;
      state.theme = newTheme;
    },
  },
  actions: {
    async SWITCH_THEME({ commit, state }) {
      // get the current theme of app
      const currentTheme = state.theme;
      // get system perfered theme
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? THEMES.DARK
        : THEMES.LIGHT;
      // calculate the new theme
      let newTheme;
      if (currentTheme === THEMES.AUTO) {
        // if in auto mode, switch to custom mode
        newTheme = systemTheme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
      } else {
        // if in custom mode
        newTheme = currentTheme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
        if (newTheme === systemTheme) {
          // if target theme is the system perfered theme, back to auto
          newTheme = THEMES.AUTO;
        }
      }
      // set the body attribute
      document.body.setAttribute(THEME_BODY_ATTR, newTheme);
      // commit theme change
      commit('UPDATE_THEME', { newTheme });
      // save to `localStorage`
      setLS(THEME_STORAGE_KEY, newTheme);
    },
  },
});
