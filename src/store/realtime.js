import { $api } from '@/plugins/axios';

export default {
  namespaced: true,
  state: () => ({
    inited: false,

    activeUsers: 0, // active users
    deviceCategorys: [], // device categories
    pageViews: [], // page views
    userEvents: [], // user events
    userRegions: [], // user regions
  }),

  mutations: {
    // set inited
    // payload: { value }
    xmSetInited(state, payload) {
      const { value } = payload;
      state.inited = Boolean(value);
    },

    // set all realtime data
    // payload: { au, dc, pv, ue, ur }
    xmSetAll(state, payload) {
      const { au, dc, pv, ue, ur } = payload;
      state.activeUsers = au;
      state.deviceCategorys = dc;
      state.pageViews = pv;
      state.userEvents = ue;
      state.userRegions = ur;
    },
  },

  actions: {
    // fetch all realtime data
    // payload: { _id }
    async xaFetchAll({ commit }, payload) {
      const { _id } = payload;
      const res = await $api.get(`/metrics/realtime?website=${_id}`);
      commit('xmSetAll', res.data);
      commit('xmSetInited', { value: true });
    },
  },
};
