import { $api } from '@/plugins/axios';

export default {
  namespaced: true,
  state: () => ({
    inited: false,

    pageViews: 0, // total page views
    uniqueSessions: 0, // unique user sessions
    pageViewTime: 0, // average page view time
    pageViewSteps: [], // page views by step
    uniqueSessionSteps: [], // sessions by step

    pathnames: [],
    referrers: [],
    languages: [],
    browsers: [],
    systems: [],
    platforms: [],
    locations: [],
  }),

  mutations: {
    // set all dashboard data
    // payload: { pv, us, pvt, pvs, uss, path, ref, lang, brow, sys, plat, loc }
    xmSetAll(state, payload) {
      const { pv, us, pvt, pvs, uss } = payload;
      state.pageViews = pv;
      state.uniqueSessions = us;
      state.pageViewTime = pvt;
      state.pageViewSteps = pvs;
      state.uniqueSessionSteps = uss;
      const { path, ref, lang, brow, sys, plat, loc } = payload;
      state.pathnames = path;
      state.referrers = ref;
      state.languages = lang;
      state.browsers = brow;
      state.systems = sys;
      state.platforms = plat;
      state.locations = loc;
      state.inited = true;
    },
  },

  actions: {
    // fetch all dashboard data
    // payload: { _id, range, step }
    async xaFetchAll({ commit }, payload) {
      const { _id, range, step } = payload;
      // calculate from to
      // const to = 1612846952100; // [DEBUG]
      const to = Date.now();
      const from = to - range;
      // fetch data
      const res = await $api.get(
        `/metrics/dashboard?website=${_id}&from=${from}&to=${to}&step=${step}`
      );
      commit('xmSetAll', res.data);
    },
  },
};
