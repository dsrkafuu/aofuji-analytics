/* utils */
import { getLS, setLS } from '../utils/storage.js';
import { THEME_STORAGE_KEY, THEME_BODY_ATTR, THEME_TYPES } from '../utils/constants.js';
const { AUTO, LIGHT, DARK } = THEME_TYPES;

export const THEME = {
  state: () => ({
    // init theme from `localStorage`
    theme: getLS(THEME_STORAGE_KEY) || AUTO,
  }),
  mutations: {
    /**
     * update new theme into state
     */
    UPDATE_THEME(state, payload) {
      const { newTheme } = payload;
      document.body.setAttribute(THEME_BODY_ATTR, newTheme);
      state.theme = newTheme;
      setLS(THEME_STORAGE_KEY, newTheme);
    },
  },
  actions: {
    /**
     * init theme to dom
     */
    async INIT_THEME({ state }) {
      document.body.setAttribute(THEME_BODY_ATTR, state.theme);
    },
    /**
     * trigger theme switch
     */
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
  },
};
