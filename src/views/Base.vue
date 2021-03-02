<template>
  <div class="base">
    <Navbar />

    <main class="v-container">
      <keep-alive :include="['Settings']">
        <router-view />
      </keep-alive>
    </main>

    <Footer />
  </div>
</template>

<script>
import Navbar from './Navbar.vue';
import Footer from './Footer.vue';

export default {
  name: 'Base',
  components: {
    Navbar,
    Footer,
  },

  async mounted() {
    await this.fetchCommon();
  },

  methods: {
    /**
     * fetch common data, etc. websites
     */
    async fetchCommon() {
      await this.$store.dispatch('common/xaFetchWebsites');
    },
  },
};
</script>

<style lang="scss" scoped>
.base {
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  nav,
  footer {
    flex: 0 0 auto;
  }

  main {
    flex: 1 1 auto;
  }
}
</style>
