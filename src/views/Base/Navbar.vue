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
            :to="{ name: 'Realtime', query: { website: selectedWebsite } }"
            type="full-height"
          >
            Realtime
          </VRouterLink>
          <VRouterLink
            class="item"
            :to="{ name: 'Dashboard', query: { website: selectedWebsite } }"
            type="full-height"
          >
            Dashboard
          </VRouterLink>
          <VRouterLink class="item" :to="{ name: 'Settings' }" type="full-height">
            Settings
          </VRouterLink>
        </div>
        <div class="end">
          <div class="select" v-if="showSelect">
            <VSelect :map="websitesMap" v-model="selectedWebsite" />
          </div>
          <div class="ctrl">
            <VButton class="item" type="full-height" v-if="showSignOut" @click="handleSignOut">
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
import Cookie from 'js-cookie';
import { COOKIE_TOKEN } from '@/utils/constants.js';

export default {
  name: 'Navbar',
  computed: {
    // site title from environment variables
    siteTitle() {
      return process.env.VUE_APP_TITLE || 'Vector Analytics';
    },
    // should show sign out button
    showSignOut() {
      return Boolean(this.$store.state.COMMON.account._id);
    },
    // should show common website select
    showSelect() {
      return this.$route.path.startsWith('/realtime') || this.$route.path.startsWith('/dashboard');
    },
    // common website select list
    websitesMap() {
      let data = this.$store.state.COMMON.websites;
      const map = {};
      for (let i = 0; i < data.length; i++) {
        map[data[i]._id] = { text: data[i].name };
      }
      return map;
    },
    // value for v-model bind select
    // sync with vuex
    selectedWebsite: {
      get() {
        return this.$store.state.COMMON.selectedWebsite?._id || '';
      },
      set(val) {
        if (val) {
          const _id = val;
          const name = this.websitesMap[_id];
          this.$store.commit('M_SELECT_WEBSITE', {
            _id,
            name,
          });
          // update url search param
          if (_id !== this.$route.query.website) {
            this.$router.replace({
              query: { website: _id },
            });
          }
        }
      },
    },
  },
  methods: {
    /**
     * switch the theme
     */
    handleThemeSwitch() {
      this.$store.commit('M_SWITCH_THEME');
    },
    /**
     * signout and go login
     */
    handleSignOut() {
      this.$store.commit('M_COMMON_ACCOUNT', {});
      Cookie.remove(COOKIE_TOKEN, { sameSite: 'Lax' });
      this.$router.push({
        name: 'Login',
      });
    },
  },
};
</script>

<style lang="scss">
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

    .item {
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
