import Vue from 'vue';

import AMessage from '@/components/AMessage.vue';
import { findIndex } from '@/utils/lodash';

// message id controller
class MessageID {
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
const messageID = new MessageID();

// message popup data
const messages = [];

// push/shift/trigger/remove a message
function pushMessage(id, timeout, type, text) {
  messages.push({ id, timeout, type, text });
}
function shiftMessage() {
  const message = messages.shift();
  message.timeout && clearTimeout(message.timeout);
  messageID.remove(message.id);
}
function triggerMessage({ type = 'default', text = '' }) {
  const id = messageID.get();
  const timeout = setTimeout(() => shiftMessage(), 8000);
  pushMessage(id, timeout, type, text);
}
function removeMessage(id) {
  const index = findIndex(messages, ['id', id]);
  if (index >= 0) {
    messages[index].timeout && clearTimeout(messages[index].timeout);
    messageID.remove(messages[index].id);
    messages.splice(index, 1);
  }
}

// mount `AMessage` component directly to body
const AMessageClass = Vue.extend(AMessage);
const message = new AMessageClass({
  data() {
    return { messages };
  },
  methods: {
    handleClose(id) {
      removeMessage(id);
    },
  },
});
message.$mount();
document.body.appendChild(message.$el);

// exported functions
export const $info = (text) => {
  triggerMessage({ type: 'default', text });
};
export const $error = (text) => {
  triggerMessage({ type: 'error', text });
};

export default {
  install(Vue) {
    Vue.prototype.$info = $info;
    Vue.prototype.$error = $error;
  },
};
