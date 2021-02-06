/*! vector-analytics | DSRKafuU <amzrk2.cc> | Copyright (c) Apache-2.0 License */
require('../utils/env.js')();

/* deps */
import Vue from 'vue';
Vue.config.productionTip = false;
import { router } from './router/index.js';
import { store } from './store/index.js';

/* css */
import 'normalize.css';
import './scss/index.scss';

/* components */
import VComponents from './plugins/components.js';
Vue.use(VComponents);
import VMessage from './plugins/message.js';
Vue.use(VMessage);

/* plugins */
import Axios from './plugins/axios.js';
Vue.use(Axios);
import Chart from './plugins/chartjs.js';
Vue.use(Chart);

/* app */
import App from './App.vue';
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
