import Cookie from 'js-cookie';

import router from '@/router';
const $router = router;

import { cloneDeep, findIndex } from '@/utils/lodash';
import { getLS, setLS } from '@/utils/storage';
import { STORAGE_ACCOUNT, COOKIE_TOKEN } from '@/utils/constants';

import { $api } from '@/plugins/axios';
import { $info } from '@/plugins/message';

export default {
  namespaced: true,
  state: () => ({
    // logged account data
    account: getLS(STORAGE_ACCOUNT) || null,

    // avaliable websites data for tab
    websites: [],
    curWebsite: null, // selected website

    // share mode data
    shareID: '',
  }),

  mutations: {
    // set login accout
    // payload: { _id, username }
    xmSetAccount(state, payload) {
      const { _id, username } = payload;
      state.account = { _id, username };
      setLS(STORAGE_ACCOUNT, { _id, username });
    },

    // set websites available
    // payload: [{ _id, name, ... }]
    xmSetWebsites(state, payload) {
      state.websites = cloneDeep(payload);
    },
    // set current website
    // payload: { _id, name }
    xmSetCurWebsite(state, payload) {
      const { _id, name } = payload;
      if (_id) {
        // normal mode
        if (!name) {
          const index = findIndex(state.websites, ['_id', _id]);
          if (index >= 0) {
            state.curWebsite = { ...state.websites[index] };
            return;
          }
        }
        // share mode
        else {
          state.curWebsite = { _id, name };
          return;
        }
      }
      state.curWebsite = null;
    },

    // share mode setter
    // payload: { _id }
    xmSetShareID(state, payload) {
      const { _id } = payload;
      if (_id) {
        state.shareID = _id;
      }
    },
  },

  actions: {
    // fetch whether account inited
    // payload: { username, password }
    async xaFetchInited(ctx, payload) {
      const { username, password } = payload;
      const resInited = await $api.get('/login/init');
      // if not inited
      if (resInited.status === 201) {
        await $api.post('/login/init', {
          username,
          password,
        });
      }
    },
    // go login
    // payload: { username, password }
    async xaPostLogin({ commit, dispatch }, payload) {
      // check init status
      await dispatch('xaFetchInited', payload);
      // post login
      const { username, password } = payload;
      const res = await $api.post('/login', {
        username,
        password,
      });
      commit('xmSetAccount', res.data);
      $info(`logging in as ${res.data.username}`);
    },
    // go logout
    async xaPostLogout({ commit }) {
      commit('xmSetAccount', {});
      Cookie.remove(COOKIE_TOKEN, { sameSite: 'Lax' });
      $router.push({ name: 'Login' });
      $info(`successfully logged out`);
    },

    // fet all websites
    async xaFetchWebsites({ commit }) {
      const res = await $api.get('/common');
      commit('xmSetWebsites', res.data);
      // init default selected website
      if (res.data[0]) {
        const { _id } = res.data[0];
        commit('xmSetCurWebsite', { _id });
      }
    },
    // fet all websites (share mode)
    // payload: { _id } (share id)
    async xaFetchShareWebsites({ commit }, payload) {
      const { _id } = payload;
      commit('xmSetShareID', { _id });
      const res = await $api.get(`/common?share=${_id}`);
      const { _website } = res.data;
      const { _id: websiteID, name } = _website;
      commit('xmSetCurWebsite', { _id: websiteID, name });
    },
  },
};
