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
      tabQuerys: ['websites', 'users', 'about'],
      tabs: [
        { name: 'Websites', component: WebsiteSettings },
        { name: 'Users', component: UserSettings },
        { name: 'About', component: About },
      ],
    };
  },
  computed: {
    curIndex() {
      const tabQuery = this.$route.query.tab;
      const tabIndex = this.tabQuerys.indexOf(tabQuery);
      return tabIndex >= 0 ? tabIndex : 0;
    },
    // current tab object
    curTab() {
      if (this.$store.state.WEBSITE.editing) {
        return WebsiteEdit;
      } else if (this.$store.state.USER.editing) {
        return UserEdit;
      } else {
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
      // exit editing
      if (this.$store.state.WEBSITE.editing) {
        this.$store.commit('EXIT_EDIT_WEBSITE');
      }
      if (this.$store.state.USER.editing) {
        this.$store.commit('EXIT_EDIT_USER');
      }
      const tabQuery = this.tabQuerys[newIndex];
      this.$router.push({
        name: 'Settings',
        query: {
          tab: tabQuery,
        },
      });
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
