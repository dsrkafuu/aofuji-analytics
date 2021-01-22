/* utils */
import { RIDManager } from '../utils/RIDManager.js';
const rIDManager = new RIDManager(); // id manager

export const MESSAGE = {
  state: () => ({
    // message popup data
    messages: [],
  }),
  mutations: {
    /**
     * add a new message
     */
    ADD_MESSAGE(state, payload) {
      const { id, timeout, type, text } = payload;
      state.messages.push({ id, timeout, type, text });
    },
    /**
     * remove oldest message
     */
    REMOVE_MESSAGE(state) {
      const message = state.messages.shift();
      message.timeout && clearTimeout(message.timeout);
      rIDManager.remove(message.id);
    },
  },
  actions: {
    /**
     * trigger a message
     */
    async TRIGGER_MESSAGE({ commit }, payload) {
      payload.id = rIDManager.get();
      payload.timeout = setTimeout(() => commit('REMOVE_MESSAGE'), 10000);
      commit('ADD_MESSAGE', payload);
    },
  },
};
