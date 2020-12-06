<template>
  <nav class="navbar">
    <div class="container">
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
          <span>end</span>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import GRouterLink from '../../components/GRouterLink.vue';

export default {
  name: 'Navbar',
  components: {
    GRouterLink,
  },
  computed: {
    /**
     * site title from environment variables
     */
    siteTitle() {
      return process.env.VUE_APP_TITLE || 'Goose Analytics';
    },
  },
};
</script>

<style lang="scss" src="./Navbar.scss">
</style>