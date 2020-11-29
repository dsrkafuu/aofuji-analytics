<template>
  <div class="goose">
    <Navbar />
    <main class="container">
      <keep-alive exclude="Settings">
        <router-view />
      </keep-alive>
    </main>
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
