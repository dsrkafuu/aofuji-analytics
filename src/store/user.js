/* utils */
import { findObjectIndexInArray } from '../utils/finders.js';

export const USER = {
  state: () => ({
    // currently editing
    editing: null,
    // settings data
    users: [],
  }),

  mutations: {
    // go to editing page
    // payload: { _id }
    EDIT_USER(state, payload) {
      if (payload) {
        if (payload._id) {
          const index = findObjectIndexInArray(state.users, '_id', payload._id);
          if (!Number.isNaN(index)) {
            state.editing = state.users[index];
          }
        } else {
          state.editing = {};
        }
      }
    },

    // exit editing page
    EXIT_EDIT_USER(state) {
      state.editing = null;
    },

    // update all users
    // payload: { data }
    UPDATE_ALL_USERS(state, payload) {
      if (payload && Array.isArray(payload.data)) {
        state.users = payload.data;
      }
    },

    // update a user
    // payload: { _id, data }
    UPDATE_USER(state, payload) {
      if (payload && payload._id && payload.data?._id) {
        const index = findObjectIndexInArray(state.users, '_id', payload._id);
        if (!Number.isNaN(index)) {
          state.users.splice(index, 1, payload.data);
        }
      }
    },
  },
};
