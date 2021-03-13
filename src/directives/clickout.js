import { EL_ATTR_CLICKOUT } from '@/utils/constants';

export default {
  /**
   * init directive
   * @param {Element} el
   * @param {Object} binding
   */
  bind(el, binding) {
    /**
     * handle click outside the element
     * @param {Event} evt
     */
    function handleOutClick(evt) {
      // if click self, do nothing
      if (el.contains(evt.target)) {
        return;
      }
      // if handler passed to `v-clickout`
      if (typeof binding.value === 'function') {
        binding.value(evt);
      }
    }

    // bind handler to document
    document.addEventListener('click', handleOutClick);
    el[EL_ATTR_CLICKOUT] = handleOutClick;
  },

  /**
   * remove directive
   * @param {Element} el
   */
  unbind(el) {
    document.removeEventListener('click', el[EL_ATTR_CLICKOUT]);
    delete el[EL_ATTR_CLICKOUT];
  },
};
