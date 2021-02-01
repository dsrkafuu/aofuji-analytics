<template>
  <nav class="navbar">
    <div class="g-container">
      <div class="brand">
        <GRouterLink class="item" :to="{ name: 'Base' }" type="full-height">
          {{ siteTitle }}
        </GRouterLink>
      </div>
      <div class="menu">
        <div class="start">
          <GRouterLink class="item" :to="{ name: 'Realtime' }" type="full-height">
            Realtime
          </GRouterLink>
          <GRouterLink class="item" :to="{ name: 'Dashboard' }" type="full-height">
            Dashboard
          </GRouterLink>
          <GRouterLink class="item" :to="{ name: 'Settings' }" type="full-height">
            Settings
          </GRouterLink>
        </div>
        <div class="end">
          <div class="select">
            <GSelect :data="commonWebsites" v-model="selectedWebsite" />
          </div>
          <div class="ctrl">
            <GButton class="item" type="full-height" v-if="showSignOut" @click="handleSignOut">
              <GIconSignOut />
            </GButton>
            <GButton class="item" type="full-height" @click="handleThemeSwitch">
              <GIconAdjust />
            </GButton>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
/* deps */
import Cookie from 'js-cookie';
import { cloneDeep } from 'lodash';
/* utils */
import { COOKIE_TOKEN } from '@/utils/constants.js';
import { findObjectIndexInArray } from '@/utils/finders';

export default {
  name: 'Navbar',
  data() {
    return {
      value: '',
    };
  },
  computed: {
    // site title from environment variables
    siteTitle() {
      return process.env.VUE_APP_TITLE || 'Goose Analytics';
    },
    // should show sign out button
    showSignOut() {
      return Boolean(this.$store.state.COMMON.account._id);
    },
    // common website select list
    commonWebsites() {
      let data = this.$store.state.COMMON.websites;
      data = cloneDeep(data);
      for (let i = 0; i < data.length; i++) {
        data[i].value = data[i]._id;
        data[i].text = data[i].name;
      }
      return data;
    },
    // value for v-model bind select
    // sync with vuex
    selectedWebsite: {
      get() {
        return this.$store.state.COMMON.selectedWebsite?._id || '';
      },
      set(val) {
        const index = findObjectIndexInArray(this.commonWebsites, 'value', val);
        if (!Number.isNaN(index)) {
          this.$store.commit('M_SELECT_WEBSITE', {
            _id: this.commonWebsites[index]._id,
            name: this.commonWebsites[index].name,
          });
          // update url search param
          this.$router.replace({
            query: { website: this.commonWebsites[index]._id },
          });
        }
      },
    },
  },
  methods: {
    /**
     * switch the theme
     */
    handleThemeSwitch() {
      this.$store.commit('SWITCH_THEME');
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

  .g-container {
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
  }
}
</style>
