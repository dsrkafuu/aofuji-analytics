<template>
  <nav class="navbar">
    <div class="container">
      <div class="navbar-brand">
        <GRouterLink class="navbar-item" :to="{ name: 'goose' }" type="full-height">
          {{ siteTitle }}
        </GRouterLink>
      </div>
      <div class="navbar-menu">
        <div class="navbar-start">
          <GRouterLink class="navbar-item" :to="{ name: 'dashboard' }" type="full-height">
            Dashboard
          </GRouterLink>
          <GRouterLink class="navbar-item" :to="{ name: 'realtime' }" type="full-height">
            Realtime
          </GRouterLink>
          <GRouterLink class="navbar-item" :to="{ name: 'settings' }" type="full-height">
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