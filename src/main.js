/*! goose-analytics | DSRKafuU <amzrk2.cc> | Copyright (c) Apache-2.0 License */
require('../utils/env.js')();

/* deps */
import Vue from 'vue';
Vue.config.productionTip = false;
import { router } from './router/index.js';
import store from './store/index.js';

/* css */
import 'normalize.css';
import './scss/index.scss';

/* components */
import App from './App.vue';
import GComponents from './plugins/components.js';
Vue.use(GComponents);
import GMessage from './plugins/message.js';
Vue.use(GMessage);

/* plugins */
import AxiosPlugin from './plugins/axios.js';
Vue.use(AxiosPlugin);

/* app */
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
