<template>
  <div class="base">
    <Navbar />

    <main class="v-container">
      <keep-alive>
        <router-view />
      </keep-alive>
    </main>
  </div>
</template>

<script>
import Navbar from './Navbar.vue';

export default {
  name: 'Base',
  components: {
    Navbar,
  },
  methods: {
    /**
     * fetch common data, etc. websites
     */
    async fetchCommon() {
      await this.$store.dispatch('common/xaFetchWebsites');
    },
  },
  async mounted() {
    await this.fetchCommon();
  },
};
</script>
