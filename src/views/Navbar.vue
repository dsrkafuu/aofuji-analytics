<template>
  <nav class="navbar">
    <div class="a-container">
      <div class="brand">
        <ARouterLink
          class="item"
          :to="{ name: 'Dashboard', query: curWebsite ? { website: curWebsite } : {} }"
          type="full-height"
        >
          {{ siteTitle }}
        </ARouterLink>
      </div>
      <div class="menu">
        <div class="start">
          <template v-if="shareID">
            <span class="item expire">
              <ALoading :loading="!shareWebsite" />
              {{ shareWebsite }}
            </span>
          </template>
          <template v-else>
            <ARouterLink
              class="item"
              :to="{ name: 'Dashboard', query: curWebsite ? { website: curWebsite } : {} }"
              type="full-height"
            >
              Dashboard
            </ARouterLink>
            <ARouterLink
              class="item"
              :to="{ name: 'Realtime', query: curWebsite ? { website: curWebsite } : {} }"
              type="full-height"
            >
              Realtime
            </ARouterLink>
            <ARouterLink class="item" :to="{ name: 'Settings' }" type="full-height">
              Settings
            </ARouterLink>
          </template>
        </div>
        <div class="end">
          <div class="select" v-if="showSelectWebsite">
            <ASelect :map="websitesMap" v-model="curWebsite" />
          </div>
          <div class="ctrl">
            <AButton class="item" type="full-height" v-if="showLogout" @click="handleLogout">
              <AIconSignOut />
            </AButton>
            <AButton class="item" type="full-height" @click="handleThemeSwitch">
              <AIconAdjust />
            </AButton>
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
      return process.env.VUE_APP_TITLE || 'Aofuji Analytics';
    },
    // should show logout button
    showLogout() {
      if (this.shareID) {
        return false;
      }
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

    // share mode computes
    shareID() {
      return this.$store.state.common.shareID || '';
    },
    shareWebsite() {
      return this.$store.state.common.curWebsite?.name || '';
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

  .a-container {
    display: flex;
    height: $navbar-height;
    line-height: $navbar-height;
  }

  @media screen and (max-width: $responsive-tablet + $responsive-offset) {
    height: $navbar-height-sm * 2;
  }
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

// share mode styles
.expire {
  padding: 0 $space-base;
  position: relative;
  width: 100%;

  .a-loading {
    justify-content: flex-start;
    padding-left: $space-base;
  }
}
</style>
