/*! goose-analytics | DSRKafuU <amzrk2.cc> | Copyright (c) Apache-2.0 License */
require('../utils/env')();

/* deps */
import Vue from 'vue';
Vue.config.productionTip = false;
import router from './router';
import store from './store';

/* css */
import 'normalize.css';
import './scss/index.scss';

/* components */
import App from './App.vue';

/* plugins */
import MessagePlugin from './plugins/message.js';
Vue.use(MessagePlugin);
import AxiosPlugin from './plugins/axios.js';
Vue.use(AxiosPlugin);

/* app */
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
