import Vue from 'vue';
import GMessage from '../components/GMessage.vue';
import store from '../store';

/**
 * init `$info` and `$error` on vm
 * @param {Vue} app
 */
export function initMessage(app) {
  Vue.prototype.$info = (text) => {
    app.$store.dispatch('TRIGGER_MESSAGE', { type: 'default', text });
  };
  Vue.prototype.$error = (text) => {
    app.$store.dispatch('TRIGGER_MESSAGE', { type: 'error', text });
  };

  // mount message directly to body
  const GMessageClass = Vue.extend(GMessage);
  const message = new GMessageClass({
    store,
  });
  message.$mount();
  document.body.appendChild(message.$el);
}
