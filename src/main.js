/*! vector-analytics | DSRKafuU (https://dsrkafuu.su) | Copyright (c) Apache-2.0 License */

import Vue from 'vue';
Vue.config.productionTip = false;
import router from './router';
import store from './store';

import 'normalize.css';
import './scss/index.scss';

import VComponents from './plugins/components';
Vue.use(VComponents);
import VMessage from './plugins/message';
Vue.use(VMessage);
import Axios from './plugins/axios';
Vue.use(Axios);

import App from './App.vue';

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
