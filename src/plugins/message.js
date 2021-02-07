import VMessage from '@/components/VMessage.vue';
import { store } from '@/store/index.js';

export class MessageID {
  /**
   * @constructor
   * init id set
   */
  constructor() {
    this.set = new Set();
  }

  /**
   * @public
   * get a unique id
   * @return {string}
   */
  get() {
    let id = Math.random().toString(16).slice(2, 12);
    while (this.set.has(id)) {
      id = Math.random().toString(16).slice(2, 12);
    }
    this.set.add(id);
    return id;
  }

  /**
   * @public
   * remove a deprecated id
   * @param {string} id
   */
  remove(id) {
    this.set.delete(id);
  }
}

export default {
  /**
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
