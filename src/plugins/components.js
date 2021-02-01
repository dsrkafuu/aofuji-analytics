import GIconAdjust from '@/assets/icons/adjust.svg';
import GIconCheck from '@/assets/icons/check.svg';
import GIconEdit from '@/assets/icons/edit.svg';
import GIconPlus from '@/assets/icons/plus.svg';
import GIconSignOut from '@/assets/icons/sign-out.svg';
import GIconTimes from '@/assets/icons/times.svg';
import GIconTrash from '@/assets/icons/trash.svg';
import GIconChevronDown from '@/assets/icons/chevron-down.svg';
import GIconChevronUp from '@/assets/icons/chevron-up.svg';

import GButton from '@/components/GButton.vue';
import GCard from '@/components/GCard.vue';
import GHeader from '@/components/GHeader.vue';
import GInput from '@/components/GInput.vue';
import GLabel from '@/components/GLabel.vue';
import GSelect from '@/components/GSelect.vue';
import GList from '@/components/GList.vue';
import GRouterLink from '@/components/GRouterLink.vue';

export default {
  /**
   * install global components
   * @param {Vue} Vue
   */
  install(Vue) {
    Vue.component('GIconAdjust', GIconAdjust);
    Vue.component('GIconCheck', GIconCheck);
    Vue.component('GIconEdit', GIconEdit);
    Vue.component('GIconPlus', GIconPlus);
    Vue.component('GIconSignOut', GIconSignOut);
    Vue.component('GIconTimes', GIconTimes);
    Vue.component('GIconTrash', GIconTrash);
    Vue.component('GIconChevronDown', GIconChevronDown);
    Vue.component('GIconChevronUp', GIconChevronUp);

    /* basic */
    Vue.component('GButton', GButton);
    Vue.component('GCard', GCard);
    Vue.component('GInput', GInput);
    Vue.component('GLabel', GLabel);
    Vue.component('GHeader', GHeader);
    Vue.component('GSelect', GSelect);

    /* derived */
    Vue.component('GRouterLink', GRouterLink);
    Vue.component('GList', GList);
  },
};
