<template>
  <div class="settings">
    <div class="ctrl">
      <VCard>
        <VButton
          v-for="(tab, index) of tabs"
          :key="tab.name"
          type="full-width"
          @click.prevent="changeTab(index)"
          :active="index === curIndex"
        >
          {{ tab.name }}
        </VButton>
      </VCard>
    </div>
    <div class="content">
      <VCard>
        <keep-alive>
          <component :is="curTab"></component>
        </keep-alive>
      </VCard>
    </div>
  </div>
</template>

<script>
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
    // current tab index
    curIndex() {
      const tabQuery = this.$route.query.tab;
      const tabIndex = this.tabQuerys.indexOf(tabQuery);
      return tabIndex >= 0 ? tabIndex : 0;
    },
    // current tab component object
    curTab() {
      if (this.$store.state.settings.editWebsite) {
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
      if (this.$store.state.settings.editWebsite) {
        this.$store.commit('xmSetEditWebsite', {});
      }
      // change tab
      const tabQuery = this.tabQuerys[newIndex];
      this.$router.replace({ query: { tab: tabQuery } });
    },
  },
};
</script>

<style lang="scss" scoped>
.settings {
  display: flex;
  margin: $space-lg;
}

.ctrl {
  flex: 0 0 20%;
  .v-card {
    padding: $space-base 0;
  }
}
.content {
  flex: 1 1 auto;
  margin-left: $space-lg;
}
</style>
