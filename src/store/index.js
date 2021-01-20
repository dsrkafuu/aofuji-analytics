/* vue */
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

/* utils */
import { ID } from '../utils/id.js';
const idm = new ID(); // id manager
import { getLS, setLS } from '../utils/storage.js';

/* constants */
import { THEME_STORAGE_KEY, THEME_BODY_ATTR, THEME_TYPES } from '../utils/constants.js';
const { AUTO, LIGHT, DARK } = THEME_TYPES;

export default new Vuex.Store({
  state: {
    // init theme from `localStorage`
    theme: getLS(THEME_STORAGE_KEY) || AUTO,
    // message popup data
    messages: [],
    // currently editing settings
    editing: { type: '', id: '' },
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
    UPDATE_SETTING(state, payload) {
      const { type, id } = payload;
      state.editing = { type, id };
    },
  },
  actions: {
    async INIT_THEME({ state }) {
      document.body.setAttribute(THEME_BODY_ATTR, state.theme);
    },
    async SWITCH_THEME({ commit, state }) {
      // get the current theme of app
      const curTheme = state.theme;
      // get system perfered theme
      const sysTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK : LIGHT;
      // calculate the new theme
      let newTheme;
      if (curTheme === AUTO) {
        // if in auto mode, switch to custom mode
        newTheme = sysTheme === LIGHT ? DARK : LIGHT;
      } else {
        // if in custom mode
        newTheme = curTheme === LIGHT ? DARK : LIGHT;
        if (newTheme === sysTheme) {
          // if target theme is the system perfered theme, back to auto
          newTheme = AUTO;
        }
      }
      // commit theme change
      commit('UPDATE_THEME', { newTheme });
    },
    async TRIGGER_MESSAGE({ commit }, payload) {
      commit('ADD_MESSAGE', payload);
      setTimeout(() => commit('REMOVE_MESSAGE'), 10000);
    },
    async EDIT_SETTING({ commit }, payload) {
      if (payload && payload.type) {
        commit('UPDATE_SETTING', payload);
      } else {
        commit('UPDATE_SETTING', { type: '', id: '' });
      }
    },
  },
});
