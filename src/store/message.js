import { findIndex } from '@/utils/lodash.js';
import { MessageID } from '@/plugins/message.js';
const mid = new MessageID(); // message id manager

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
      mid.remove(message.id);
    },
    // remove a message
    // payload: { id }
    M_REMOVE_MESSAGE(state, payload) {
      const index = findIndex(state.messages, ['id', payload.id]);
      if (index >= 0) {
        state.messages[index].timeout && clearTimeout(state.messages[index].timeout);
        mid.remove(state.messages[index].id);
        state.messages.splice(index, 1);
      }
    },
  },

  actions: {
    // trigger a message
    // payload: { id, text }
    async A_TRIGGER_MESSAGE({ commit }, payload) {
      const newPayload = { ...payload };
      newPayload.id = mid.get();
      newPayload.timeout = setTimeout(() => commit('M_SHIFT_MESSAGE'), 10000);
      commit('M_ADD_MESSAGE', newPayload);
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
