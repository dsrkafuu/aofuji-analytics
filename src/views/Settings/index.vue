<template>
  <div class="settings">
    <div class="settings-ctrl">
      <GCard>
        <GButton
          v-for="(tab, index) of tabs"
          :key="tab.name"
          type="full-width"
          @click.prevent="changeTab(index)"
          :active="index === curIndex"
        >
          {{ tab.name }}
        </GButton>
      </GCard>
    </div>
    <div class="settings-content">
      <GCard>
        <keep-alive>
          <component :is="curTab"></component>
        </keep-alive>
      </GCard>
    </div>
  </div>
</template>

<script>
/* components */
import GCard from '../../components/GCard.vue';
import GButton from '../../components/GButton.vue';
import UserSettings from './UserSettings.vue';
import WebsiteSettings from './WebsiteSettings.vue';
import About from './About.vue';
import UserEdit from './UserEdit.vue';
import WebsiteEdit from './WebsiteEdit.vue';
/* utils */
import { SETTING_TYPES } from '../../utils/constants.js';
const { USER, WEBSITE } = SETTING_TYPES;

export default {
  name: 'Settings',
  components: {
    GCard,
    GButton,
    UserSettings,
    WebsiteSettings,
    About,
    UserEdit,
    WebsiteEdit,
  },
  data() {
    return {
      tabs: [
        { name: 'Users', component: UserSettings },
        { name: 'Websites', component: WebsiteSettings },
        { name: 'About', component: About },
      ],
      curIndex: 0, // current index
    };
  },
  computed: {
    // current tab object
    curTab() {
      switch (this.$store.state.editing.type) {
        case USER:
          return UserEdit;
        case WEBSITE:
          return WebsiteEdit;
        default:
          return this.tabs[this.curIndex].component;
      }
    },
  },
  methods: {
    /**
     * change current tab
     * @param {number} newIndex
     */
    changeTab(newIndex) {
      this.$store.dispatch('EDIT_SETTING'); // exit editing
      this.curIndex = newIndex;
    },
  },
};
</script>

<style lang="scss">
.settings {
  display: flex;
  margin: $space-lg;
}

.settings-ctrl {
  flex: 0 0 20%;

  .g-card {
    padding: $space-base 0;
  }
}

.settings-content {
  flex: 1 1 auto;
  margin-left: $space-lg;
}
</style>
