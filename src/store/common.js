/* deps */
import { cloneDeep } from 'lodash';

/* utils */
import { getLS, setLS } from '@/utils/storage.js';
import { STORAGE_ACCOUNT } from '@/utils/constants.js';

export const COMMON = {
  state: () => ({
    // login data
    account: getLS(STORAGE_ACCOUNT) || {},
    // avaliable websites data
    websites: [],
  }),

  mutations: {
    // payload: { _id, username }
    M_COMMON_ACCOUNT(state, payload) {
      const { _id, username } = payload;
      if (_id && username) {
        state.account = { _id, username };
        setLS(STORAGE_ACCOUNT, { _id, username });
      }
    },

    // payload: [{ _id, name }]
    M_COMMON_WEBSITES(state, payload) {
      if (Array.isArray(payload)) {
        state.websites = cloneDeep(payload);
      }
    },
  },
};
