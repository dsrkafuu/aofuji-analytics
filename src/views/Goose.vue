<template>
  <div class="goose">
    <Navbar />
    <router-view />
  </div>
</template>

<script>
/* components */
import Navbar from './partials/Navbar.vue';

export default {
  name: 'Goose',
  components: {
    Navbar,
  },
};
</script>
