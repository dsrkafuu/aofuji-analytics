import GMessage from '@/components/GMessage.vue';
import store from '@/store/index.js';

export default {
  /**
   * install message module
   * @param {Vue} Vue
   */
  install(Vue) {
    // mount `GMessage` component directly to body
    const GMessageClass = Vue.extend(GMessage);
    const message = new GMessageClass({
      store,
    });
    message.$mount();
    document.body.appendChild(message.$el);

    // add global functions
    Vue.prototype.$info = (text) => {
      store.dispatch('TRIGGER_MESSAGE', { type: 'default', text });
    };
    Vue.prototype.$error = (text) => {
      store.dispatch('TRIGGER_MESSAGE', { type: 'error', text });
    };
  },
};
