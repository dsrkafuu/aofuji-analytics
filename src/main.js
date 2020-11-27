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

/* app */
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
