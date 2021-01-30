/* utils */
import { getLS } from '@/utils/storage.js';
import { STORAGE_ACCOUNT } from '@/utils/constants.js';

export const COMMON = {
  state: () => ({
    // login data
    account: getLS(STORAGE_ACCOUNT) || {},
    // avaliable websites data
    websites: [],
  }),
  mutations: {},
  actions: {},
};
