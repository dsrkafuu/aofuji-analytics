<template>
  <div class="settings">
    <div class="ctrl">
      <ACard>
        <AButton
          v-for="(tab, key) of tabsMap"
          :key="key"
          type="full-width"
          @click.prevent="changeTab(key)"
          :active="key === curTab"
        >
          {{ tab.text }}
        </AButton>
      </ACard>
    </div>
    <div class="content">
      <ACard>
        <keep-alive>
          <component :is="curTabComponent"></component>
        </keep-alive>
      </ACard>
    </div>
  </div>
</template>

<script>
import Website from './Website.vue';
import WebsiteEdit from './WebsiteEdit.vue';
import Account from './Account.vue';
import Share from './Share.vue';
import ShareEdit from './ShareEdit.vue';
import About from './About.vue';

const tabsMap = {
  website: { text: 'Website', component: Website },
  account: { text: 'Account', component: Account },
  share: { text: 'Share', component: Share },
  about: { text: 'About', component: About },
};

export default {
  name: 'Settings',
  components: {
    Website,
    WebsiteEdit,
    Account,
    Share,
    ShareEdit,
    About,
  },

  data() {
    return {
      curTab: 'website',
      tabsMap,
    };
  },
  computed: {
    // current tab component object
    curTabComponent() {
      if (this.$store.state.settings.editWebsite) {
        return WebsiteEdit;
      } else if (this.$store.state.settings.editShare) {
        return ShareEdit;
      } else {
        return tabsMap[this.curTab].component;
      }
    },
  },

  activated() {
    // fix missing tab query
    const query = this.$route.query.tab;
    if (query) {
      this.curTab = query;
    } else {
      this.$router.replace({ query: { tab: this.curTab } });
    }
  },

  methods: {
    /**
     * change current tab
     * @param {string} newTab
     */
    changeTab(newTab) {
      // exit editing
      if (this.$store.state.settings.editWebsite) {
        this.$store.commit('settings/xmSetEditWebsite', {});
      }
      if (this.$store.state.settings.editShare) {
        this.$store.commit('settings/xmSetEditShare', {});
      }
      // change tab
      this.curTab = newTab;
      if (this.$route.query.tab !== newTab) {
        this.$router.replace({ query: { tab: newTab } });
      }
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

  .a-card {
    padding: $space-base 0;
  }
}

.content {
  flex: 1 1 auto;
  margin-left: $space-lg;
}
</style>
