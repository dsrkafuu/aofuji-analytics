<template>
  <nav class="navbar">
    <div class="v-container">
      <div class="brand">
        <VButton class="item" type="full-height" href="https://appvector.icu" external>
          {{ siteTitle }}
        </VButton>
      </div>
      <div class="menu">
        <div class="start">
          <VRouterLink
            class="item"
            :to="{ name: 'Dashboard', query: curWebsite ? { website: curWebsite } : {} }"
            type="full-height"
          >
            Dashboard
          </VRouterLink>
          <VRouterLink
            class="item"
            :to="{ name: 'Realtime', query: curWebsite ? { website: curWebsite } : {} }"
            type="full-height"
          >
            Realtime
          </VRouterLink>
          <VRouterLink class="item" :to="{ name: 'Settings' }" type="full-height">
            Settings
          </VRouterLink>
        </div>
        <div class="end">
          <div class="select" v-if="showSelectWebsite">
            <VSelect :map="websitesMap" v-model="curWebsite" />
          </div>
          <div class="ctrl">
            <VButton class="item" type="full-height" v-if="showLogout" @click="handleLogout">
              <VIconSignOut />
            </VButton>
            <VButton class="item" type="full-height" @click="handleThemeSwitch">
              <VIconAdjust />
            </VButton>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
  computed: {
    // site title from environment variables
    siteTitle() {
      return process.env.VUE_APP_TITLE || 'Vector Analytics';
    },
    // should show logout button
    showLogout() {
      return Boolean(this.$store.state.common.account?._id);
    },
    // should show common website select
    showSelectWebsite() {
      return this.$route.path.startsWith('/realtime') || this.$route.path.startsWith('/dashboard');
    },
    // common website select list
    websitesMap() {
      let data = this.$store.state.common.websites || [];
      const map = {};
      for (let i = 0; i < data.length; i++) {
        map[data[i]._id] = { text: data[i].name };
      }
      return map;
    },
    // value for v-model bind select, sync with vuex
    curWebsite: {
      get() {
        return this.$store.state.common.curWebsite?._id || '';
      },
      set(val) {
        if (val) {
          this.$store.commit('dashboard/xmSetInited', { value: false });
          this.$store.commit('realtime/xmSetInited', { value: false });
          this.$store.commit('common/xmSetCurWebsite', { _id: val });
        }
      },
    },
  },
  methods: {
    /**
     * switch the theme
     */
    async handleThemeSwitch() {
      await this.$store.dispatch('theme/xaSwitchTheme');
    },
    /**
     * logout and go login
     */
    async handleLogout() {
      await this.$store.dispatch('common/xaPostLogout');
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  background-color: var(--color-bg);
  height: $navbar-height;
  box-shadow: var(--shadow);

  .v-container {
    display: flex;
    height: $navbar-height;
    line-height: $navbar-height;
  }

  @media screen and (max-width: $responsive-tablet + $responsive-offset) {
    height: $navbar-height-sm * 2;
  }

  .brand {
    flex: 0 0 auto;
    font-size: $font-size-md;
    font-weight: 500;
    .navbar-item {
      padding: 0 $space-lg;
      color: var(--color-font) !important;
    }
  }

  .menu {
    flex: 1 1 auto;
    display: flex;
  }
  .select {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .start {
    flex: 1 1 auto;
    display: flex;
  }
  .end {
    flex: 0 0 auto;
    display: flex;
    gap: $space-sm;
  }
}
</style>
