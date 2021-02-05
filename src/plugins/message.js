import VMessage from '@/components/VMessage.vue';
import { store } from '@/store/index.js';

export default {
  /**
   * install message module
   * @param {Vue} Vue
   */
  install(Vue) {
    // mount `VMessage` component directly to body
    const VMessageClass = Vue.extend(VMessage);
    const message = new VMessageClass({
      store,
    });
    message.$mount();
    document.body.appendChild(message.$el);

    // add global functions
    Vue.prototype.$info = (text) => {
      store.dispatch('A_TRIGGER_MESSAGE', { type: 'default', text });
    };
    Vue.prototype.$error = (text) => {
      store.dispatch('A_TRIGGER_MESSAGE', { type: 'error', text });
    };
  },
};
