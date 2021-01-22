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
import WebsiteSettings from './WebsiteSettings.vue';
import UserSettings from './UserSettings.vue';
import About from './About.vue';
import WebsiteEdit from './WebsiteEdit.vue';
import UserEdit from './UserEdit.vue';

/* utils */
import { SETTINGS_TYPES } from '../../utils/constants.js';
const { USER, WEBSITE } = SETTINGS_TYPES;

export default {
  name: 'Settings',
  components: {
    WebsiteSettings,
    UserSettings,
    About,
    WebsiteEdit,
    UserEdit,
  },
  data() {
    return {
      tabs: [
        { name: 'Websites', component: WebsiteSettings },
        { name: 'Users', component: UserSettings },
        { name: 'About', component: About },
      ],
      curIndex: 0, // current index
    };
  },
  computed: {
    // current tab object
    curTab() {
      switch (this.$store.state.SETTINGS.editing.type) {
        case WEBSITE:
          return WebsiteEdit;
        case USER:
          return UserEdit;
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
      this.$store.commit('EXIT_EDITING'); // exit editing
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
