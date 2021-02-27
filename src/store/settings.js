import { findIndex } from '@/utils/lodash';

import { $api } from '@/plugins/axios';
import { $info } from '@/plugins/message';

export default {
  namespaced: true,
  state: () => ({
    editWebsite: null, // currently editing website
    websites: [], // all websites
  }),

  mutations: {
    // set currently editing website
    // payload: { _id }
    xmSetEditWebsite(state, payload) {
      const { _id } = payload;
      if (_id) {
        const index = findIndex(state.websites, ['_id', _id]);
        if (index >= 0) {
          state.editWebsite = { ...state.websites[index] };
          return;
        }
      } else if (_id === '') {
        state.editWebsite = {};
        return;
      }
      state.editWebsite = null;
    },
    // set all websites
    // payload: [{ _id, name, ... }]
    xmSetWebsites(state, payload) {
      state.websites = payload;
    },
    // add a website
    // payload: { _id, name, ... }
    xmAddWebsite(state, payload) {
      state.websites.push({ ...payload });
    },
    // remove a website
    // payload: { _id }
    xmRemoveWebsite(state, payload) {
      const index = findIndex(state.websites, ['_id', payload._id]);
      if (index >= 0) {
        state.websites.splice(index, 1);
      }
    },
    // update a website
    // payload: { _id, name, ... }
    xmUpdateWebsite(state, payload) {
      const index = findIndex(state.websites, ['_id', payload._id]);
      if (index >= 0) {
        state.websites.splice(index, 1, { ...payload });
      }
    },
  },

  actions: {
    // fet all websites
    async xaFetchWebsites({ commit }) {
      const res = await $api.get('/admin/website');
      commit('xmSetWebsites', res.data);
    },
    // add a website
    // payload: { _id, name, ... }
    async xaPostWebsite({ commit }, payload) {
      const { name, url, base, isPublic } = payload;
      const res = await $api.post('/admin/website', { name, url, base, isPublic });
      commit('xmAddWebsite', res.data);
      $info('new website added');
    },
    // modify a website
    // payload: { _id, name, ... }
    async xaPutWebsite({ commit }, payload) {
      const { _id, name, url, base, isPublic } = payload;
      const res = await $api.put(`/admin/website/${_id}`, { name, url, base, isPublic });
      commit('xmUpdateWebsite', res.data);
      $info('website modified');
    },
    // delete a website
    // payload: { _id }
    async xaDeleteWebsite({ commit }, payload) {
      const { _id } = payload;
      await $api.delete(`/admin/website/${_id}`);
      commit('xmRemoveWebsite', { _id });
      $info('website removed');
    },

    // modify a account
    // payload: { _id, username, password }
    async xaPutAccount({ commit, dispatch }, payload) {
      const { _id, username, password } = payload;
      const res = await $api.put(`/admin/account/${_id}`, { username, password });
      commit('xmUpdateWebsite', res.data);
      $info('account modified');
      // log out after account changed
      await dispatch('common/xaPostLogout', null, { root: true });
      $info('please login again');
    },
  },
};
