/* utils */
import { findObjectIndexInArray } from '../utils/finders.js';

export const WEBSITE = {
  state: () => ({
    // currently editing
    editing: null,
    // settings data
    websites: [],
  }),

  mutations: {
    // go to editing page
    // payload: { _id }
    EDIT_WEBSITE(state, payload) {
      if (payload) {
        if (payload._id) {
          const index = findObjectIndexInArray(state.websites, '_id', payload._id);
          if (!Number.isNaN(index)) {
            state.editing = state.websites[index];
          }
        } else {
          state.editing = {};
        }
      }
    },

    // exit editing page
    EXIT_EDIT_WEBSITE(state) {
      state.editing = null;
    },

    // update all websites
    // payload: { data }
    UPDATE_ALL_WEBSITES(state, payload) {
      if (payload && Array.isArray(payload.data)) {
        state.websites = payload.data;
      }
    },

    // add a website
    // payload: { data }
    ADD_WEBSITE(state, payload) {
      if (payload && payload.data?._id) {
        state.websites.push(payload.data);
      }
    },

    // remove a website
    // payload: { _id }
    REMOVE_WEBSITE(state, payload) {
      if (payload && payload._id) {
        const index = findObjectIndexInArray(state.websites, '_id', payload._id);
        if (!Number.isNaN(index)) {
          state.websites.splice(index, 1);
        }
      }
    },

    // update a website
    // payload: { _id, data }
    UPDATE_WEBSITE(state, payload) {
      if (payload && payload._id && payload.data?._id) {
        const index = findObjectIndexInArray(state.websites, '_id', payload._id);
        if (!Number.isNaN(index)) {
          state.websites.splice(index, 1, payload.data);
        }
      }
    },
  },
};
