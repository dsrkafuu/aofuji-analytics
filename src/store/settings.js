/* utils */
import { SETTINGS_TYPES } from '../utils/constants.js';
const { USER, WEBSITE } = SETTINGS_TYPES;
import { findObjectIndexInArray } from '../utils/finders.js';

export const SETTINGS = {
  state: () => ({
    // currently editing state
    editing: { type: '', id: '' },
    // settings data
    users: [],
    websites: [],
  }),

  mutations: {
    // go to editing page
    // payload: { type, id }
    TRIGGER_EDITING(state, payload) {
      if (payload && [USER, WEBSITE].includes(payload.type)) {
        let { type, id } = payload;
        !id && (id = '');
        state.editing = { type, id };
      }
    },
    // exit editing page
    EXIT_EDITING(state) {
      state.editing = { type: '', id: '' };
    },

    // update all users
    // payload: { data }
    UPDATE_ALL_USERS(state, payload) {
      if (payload && Array.isArray(payload.data)) {
        state.users = payload.data;
      }
    },
    // update a user
    // payload: { id, date }
    UPDATE_USER(state, payload) {
      if (payload && payload.id && payload.data?._id) {
        const index = findObjectIndexInArray(state.users, '_id', payload.id);
        if (!Number.isNaN(index)) {
          state.users.splice(index, 1, payload.data);
        }
      }
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
    // payload: { id }
    REMOVE_WEBSITE(state, payload) {
      if (payload && payload.id) {
        const index = findObjectIndexInArray(state.websites, '_id', payload.id);
        if (!Number.isNaN(index)) {
          state.websites.splice(index, 1);
        }
      }
    },
    // update a website
    // payload: { id, date }
    UPDATE_WEBSITE(state, payload) {
      if (payload && payload.id && payload.data?._id) {
        const index = findObjectIndexInArray(state.websites, '_id', payload.id);
        if (!Number.isNaN(index)) {
          state.websites.splice(index, 1, payload.data);
        }
      }
    },
  },

  actions: {},
};
