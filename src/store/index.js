/* vue */
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

/* deps */
import { ID } from '../utils/id.js';
const idm = new ID(); // id manager

/* vars */
import { THEME_STORAGE_KEY, THEME_BODY_ATTR, THEMES } from '../utils/constants.js';
import { getLS, setLS } from '../utils/storage.js';

export default new Vuex.Store({
  state: {
    // init theme from `localStorage`
    theme: getLS(THEME_STORAGE_KEY) || THEMES.AUTO,
    // message popup data
    messages: [],
  },
  mutations: {
    UPDATE_THEME(state, payload) {
      const { newTheme } = payload;
      document.body.setAttribute(THEME_BODY_ATTR, newTheme);
      state.theme = newTheme;
      setLS(THEME_STORAGE_KEY, newTheme);
    },
    ADD_MESSAGE(state, payload) {
      const { text, type } = payload;
      const id = idm.get();
      state.messages.push({ id, text, type });
    },
    REMOVE_MESSAGE(state) {
      const message = state.messages.shift();
      idm.remove(message.id);
    },
  },
  actions: {
    async INIT_THEME({ state }) {
      document.body.setAttribute(THEME_BODY_ATTR, state.theme);
    },
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
      // commit theme change
      commit('UPDATE_THEME', { newTheme });
    },
    async TRIGGER_MESSAGE({ commit }, payload) {
      commit('ADD_MESSAGE', payload);
      setTimeout(() => commit('REMOVE_MESSAGE'), 10000);
    },
  },
});
