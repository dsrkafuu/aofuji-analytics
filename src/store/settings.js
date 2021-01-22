export const SETTINGS = {
  state: () => ({
    // currently editing settings
    editing: { type: '', id: '' },
  }),
  mutations: {
    /**
     * update new setting into state
     */
    UPDATE_SETTING(state, payload) {
      const { type, id } = payload;
      state.editing = { type, id };
    },
  },
  actions: {
    /**
     * change editing state
     * `payload==null` to exit editing
     */
    async EDIT_SETTING({ commit }, payload) {
      if (payload && payload.type) {
        commit('UPDATE_SETTING', payload);
      } else {
        commit('UPDATE_SETTING', { type: '', id: '' });
      }
    },
  },
};
