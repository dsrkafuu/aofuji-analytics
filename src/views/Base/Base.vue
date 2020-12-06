<template>
  <div class="base">
    <Navbar />
    <main class="g-container">
      <keep-alive>
        <router-view />
      </keep-alive>
    </main>
  </div>
</template>

<script>
/* components */
import Navbar from './Navbar.vue';

export default {
  name: 'Base',
  components: {
    Navbar,
  },
};
</script>
