<template>
  <nav class="navbar">
    <div class="g-container">
      <div class="navbar-brand">
        <GRouterLink class="navbar-item" :to="{ name: 'Base' }" type="full-height">
          {{ siteTitle }}
        </GRouterLink>
      </div>
      <div class="navbar-menu">
        <div class="navbar-start">
          <GRouterLink class="navbar-item" :to="{ name: 'Dashboard' }" type="full-height">
            Dashboard
          </GRouterLink>
          <GRouterLink class="navbar-item" :to="{ name: 'Realtime' }" type="full-height">
            Realtime
          </GRouterLink>
          <GRouterLink class="navbar-item" :to="{ name: 'Settings' }" type="full-height">
            Settings
          </GRouterLink>
        </div>
        <div class="navbar-end">
          <GButton class="navbar-item" type="full-height" @click.prevent="handleThemeSwitch">
            <GIconAdjust class="g-icon" />
          </GButton>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import GRouterLink from '../../components/GRouterLink.vue';
import GButton from '../../components/GButton.vue';
import GIconAdjust from '../../assets/icons/adjust.svg';

export default {
  name: 'Navbar',
  components: {
    GRouterLink,
    GButton,
    GIconAdjust,
  },
  computed: {
    /**
     * site title from environment variables
     */
    siteTitle() {
      return process.env.VUE_APP_TITLE || 'Goose Analytics';
    },
  },
  methods: {
    /**
     * switch the theme
     */
    handleThemeSwitch() {
      this.$store.dispatch('SWITCH_THEME');
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
}

.navbar-brand {
  flex: 0 0 auto;
  font-size: $font-size-md;
  font-weight: 500;

  .navbar-item {
    padding: 0 $space-lg;
    color: var(--color-font) !important;
  }
}

.navbar-menu {
  flex: 1 1 auto;
  display: flex;
}

.navbar-start {
  flex: 1 1 auto;
  display: flex;
}

.navbar-end {
  flex: 0 0 auto;
}
</style>