import GIconAdjust from '../assets/icons/adjust.svg';
import GIconCheck from '../assets/icons/check.svg';
import GIconEdit from '../assets/icons/edit.svg';
import GIconTimes from '../assets/icons/times.svg';
import GIconTrash from '../assets/icons/trash.svg';

export default {
  /**
   * install global icons
   * @param {Vue} Vue
   */
  install(Vue) {
    Vue.component(GIconAdjust);
    Vue.component(GIconCheck);
    Vue.component(GIconEdit);
    Vue.component(GIconTimes);
    Vue.component(GIconTrash);
  },
};
