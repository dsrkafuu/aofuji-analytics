<template>
  <div class="base">
    <Navbar />

    <main class="v-container">
      <Dashboard />
    </main>
  </div>
</template>

<script>
import Navbar from './Navbar.vue';
import Dashboard from './Dashboard/index.vue';

export default {
  name: 'Share',
  components: {
    Navbar,
    Dashboard,
  },

  async mounted() {
    // get share id
    const shareID = this.$route.query.id;
    try {
      await this.fetchCommon(shareID);
    } catch {
      // if expired or invalid share id
      this.$router.push({ name: 'Login' });
    }
  },

  methods: {
    /**
     * fetch common data, etc. websites
     * @param {string} _id share id
     */
    async fetchCommon(_id) {
      await this.$store.dispatch('common/xaFetchShareWebsites', { _id });
    },
  },
};
</script>
