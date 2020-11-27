<template>
  <nav class="navbar">
    <div class="container">
      <div class="navbar-brand">
        <router-link to="/" class="navbar-item">Goose Analytics</router-link>
      </div>
      <div class="navbar-menu">
        <div class="navbar-start">
          <router-link to="/dashboard" class="navbar-item">Dashboard</router-link>
          <router-link to="/realtime" class="navbar-item">Realtime</router-link>
          <router-link to="/settings" class="navbar-item">Settings</router-link>
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
};
</script>

<style lang="scss" src="./Navbar.scss">
</style>