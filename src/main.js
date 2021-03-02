/*! aofuji-analytics | DSRKafuU (https://dsrkafuu.su) | Copyright (c) MIT License */

import Vue from 'vue';
Vue.config.productionTip = false;
import router from './router';
import store from './store';

import 'normalize.css';
import './scss/index.scss';

import VComponents from './plugins/components';
Vue.use(VComponents);
import AMessage from './plugins/message';
Vue.use(AMessage);
import Axios from './plugins/axios';
Vue.use(Axios);

import App from './App.vue';

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
