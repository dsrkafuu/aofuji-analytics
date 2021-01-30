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
import Website from './Website.vue';
import WebsiteEdit from './WebsiteEdit.vue';
import Account from './Account.vue';
import About from './About.vue';

export default {
  name: 'Settings',
  components: {
    Website,
    WebsiteEdit,
    Account,
    About,
  },
  data() {
    return {
      tabQuerys: ['website', 'account', 'about'],
      tabs: [
        { name: 'Website', component: Website },
        { name: 'Account', component: Account },
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
        this.$store.commit('M_EXIT_EDIT_WEBSITE');
      }
      // change tab
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
