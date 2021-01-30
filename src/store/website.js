/* deps */
import { cloneDeep } from 'lodash';

/* utils */
import { findObjectIndexInArray } from '@/utils/finders.js';

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
    M_EDIT_WEBSITE(state, payload) {
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
    M_EXIT_EDIT_WEBSITE(state) {
      state.editing = null;
    },

    // update all websites
    // payload: [{ _id, name, ... }]
    M_UPDATE_ALL_WEBSITES(state, payload) {
      if (Array.isArray(payload)) {
        state.websites = cloneDeep(payload);
      }
    },

    // add a website
    // payload: { _id, name, ... }
    M_ADD_WEBSITE(state, payload) {
      if (payload && payload._id) {
        state.websites.push({ ...payload });
      }
    },

    // remove a website
    // payload: { _id }
    M_REMOVE_WEBSITE(state, payload) {
      if (payload && payload._id) {
        const index = findObjectIndexInArray(state.websites, '_id', payload._id);
        if (!Number.isNaN(index)) {
          state.websites.splice(index, 1);
        }
      }
    },

    // update a website
    // payload: { _id, name, ... }
    M_UPDATE_WEBSITE(state, payload) {
      if (payload && payload._id) {
        const index = findObjectIndexInArray(state.websites, '_id', payload._id);
        if (!Number.isNaN(index)) {
          state.websites.splice(index, 1, { ...payload });
        }
      }
    },
  },
};
