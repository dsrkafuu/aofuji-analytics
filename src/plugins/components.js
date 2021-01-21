import GButton from '../components/GButton.vue';
import GCard from '../components/GCard.vue';
import GHeader from '../components/GHeader.vue';
import GInput from '../components/GInput.vue';
import GLabel from '../components/GLabel.vue';
import GList from '../components/GList.vue';
import GRouterLink from '../components/GRouterLink.vue';

export default {
  /**
   * install global components
   * @param {Vue} Vue
   */
  install(Vue) {
    Vue.component(GButton);
    Vue.component(GCard);
    Vue.component(GHeader);
    Vue.component(GInput);
    Vue.component(GLabel);
    Vue.component(GList);
    Vue.component(GRouterLink);
  },
};
