/* utils */
import { findObjectIndexInArray } from '@/utils/finders.js';
import { RIDManager } from '@/utils/RIDManager.js';
const rIDManager = new RIDManager(); // id manager

export const MESSAGE = {
  state: () => ({
    // message popup data
    messages: [],
  }),
  mutations: {
    // add a new message
    // payload: { id, timeout, type, text }
    M_ADD_MESSAGE(state, payload) {
      state.messages.push({ ...payload });
    },
    // remove oldest message
    M_SHIFT_MESSAGE(state) {
      const message = state.messages.shift();
      message.timeout && clearTimeout(message.timeout);
      rIDManager.remove(message.id);
    },
    // remove a message
    // payload: { id }
    M_REMOVE_MESSAGE(state, payload) {
      const index = findObjectIndexInArray(state.messages, 'id', payload.id);
      state.messages[index].timeout && clearTimeout(state.messages[index].timeout);
      rIDManager.remove(state.messages[index].id);
      state.messages.splice(index, 1);
    },
  },
  actions: {
    // trigger a message
    // payload: { id, text }
    async A_TRIGGER_MESSAGE({ commit }, payload) {
      const pl = { ...payload };
      pl.id = rIDManager.get();
      pl.timeout = setTimeout(() => commit('M_SHIFT_MESSAGE'), 10000);
      commit('M_ADD_MESSAGE', pl);
    },
    // close a selected message
    // payload: { id }
    async A_CLOSE_MESSAGE({ commit }, payload) {
      if (payload && payload.id) {
        commit('M_REMOVE_MESSAGE', payload);
      }
    },
  },
};
