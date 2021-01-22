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
    ADD_MESSAGE(state, payload) {
      const { id, timeout, type, text } = payload;
      state.messages.push({ id, timeout, type, text });
    },
    // remove oldest message
    SHIFT_MESSAGE(state) {
      const message = state.messages.shift();
      message.timeout && clearTimeout(message.timeout);
      rIDManager.remove(message.id);
    },
    // remove a message
    // payload: { id }
    REMOVE_MESSAGE(state, payload) {
      const index = findObjectIndexInArray(state.messages, 'id', payload.id);
      state.messages[index].timeout && clearTimeout(state.messages[index].timeout);
      rIDManager.remove(state.messages[index].id);
      state.messages.splice(index, 1);
    },
  },
  actions: {
    // trigger a message
    async TRIGGER_MESSAGE({ commit }, payload) {
      payload.id = rIDManager.get();
      payload.timeout = setTimeout(() => commit('SHIFT_MESSAGE'), 10000);
      commit('ADD_MESSAGE', payload);
    },
    // close a selected message
    // payload: { id }
    async CLOSE_MESSAGE({ commit }, payload) {
      if (payload && payload.id) {
        commit('REMOVE_MESSAGE', payload);
      }
    },
  },
};
