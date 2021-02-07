import { getLS, setLS } from '@/utils/storage.js';
import { STORAGE_THEME, DOM_ATTR_THEME } from '@/utils/constants.js';

export const THEME = {
  state: () => ({
    // init theme from `localStorage`
    theme: getLS(STORAGE_THEME) || 'auto',
  }),

  mutations: {
    /**
     * init theme to dom
     */
    M_INIT_THEME(state) {
      document.body.setAttribute(DOM_ATTR_THEME, state.theme);
    },

    /**
     * trigger theme switch
     */
    M_SWITCH_THEME(state) {
      // get the current theme of app
      const curTheme = state.theme;
      // get system perfered theme
      const sysTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      // calculate the new theme
      let newTheme;
      if (curTheme === 'auto') {
        // if in auto mode, switch to custom mode
        newTheme = sysTheme === 'light' ? 'dark' : 'light';
      } else {
        // if in custom mode
        newTheme = curTheme === 'light' ? 'dark' : 'light';
        if (newTheme === sysTheme) {
          // if target theme is the system perfered theme, back to auto
          newTheme = 'auto';
        }
      }
      // commit theme change
      document.body.setAttribute(DOM_ATTR_THEME, newTheme);
      state.theme = newTheme;
      setLS(STORAGE_THEME, newTheme);
    },
  },
};
