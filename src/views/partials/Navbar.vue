<template>
  <nav class="navbar">
    <div class="container">
      <div class="navbar-brand">
        <router-link :to="{ name: 'goose' }" class="navbar-item">{{ siteTitle }}</router-link>
      </div>
      <div class="navbar-menu">
        <div class="navbar-start">
          <router-link :to="{ name: 'dashboard' }" class="navbar-item">Dashboard</router-link>
          <router-link :to="{ name: 'realtime' }" class="navbar-item">Realtime</router-link>
          <router-link :to="{ name: 'settings' }" class="navbar-item">Settings</router-link>
        </div>
        <div class="navbar-end">
          <span>end</span>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
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