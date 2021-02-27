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
  }),

  mutations: {
    // payload: { _id, username }
    xmSetAccount(state, payload) {
      const { _id, username } = payload;
      state.account = { _id, username };
      setLS(STORAGE_ACCOUNT, { _id, username });
    },

    // payload: [{ _id, name }]
    xmSetWebsites(state, payload) {
      state.websites = cloneDeep(payload);
    },
    // payload: { _id }
    xmSetCurWebsite(state, payload) {
      const { _id } = payload;
      if (_id) {
        const index = findIndex(state.websites, ['_id', _id]);
        if (index >= 0) {
          state.curWebsite = { ...state.websites[index] };
          return;
        }
      }
      state.curWebsite = null;
    },
  },

  actions: {
    // payload: { username, password }
    async xaFetchInited({ commit }, payload) {
      const { username, password } = payload;
      const resInited = await $api.get('/login/init');
      // if not inited
      if (resInited.status === 201) {
        await $api.post('/login/init', {
          username,
          password,
        });
      }
      commit('xmSetInited');
    },
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
      $info(`logging in as ${res.data.username}`);
      commit('xmSetAccount', res.data);
    },
    async xaPostLogout({ commit }) {
      commit('xmSetAccount', {});
      Cookie.remove(COOKIE_TOKEN, { sameSite: 'Lax' });
      $router.push({ name: 'Login' });
    },

    async xaFetchWebsites({ commit }) {
      const res = await $api.get('/common');
      commit('xmSetWebsites', res.data);
      // init default selected website
      if (res.data[0]) {
        commit('xmSetCurWebsite', res.data[0]);
      }
    },
  },
};
