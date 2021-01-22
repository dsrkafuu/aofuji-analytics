<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    // init theme to dom
    this.$store.dispatch('INIT_THEME');
  },
};
</script>
