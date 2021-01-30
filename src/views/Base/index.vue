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
/* utils */
import { logInfo, logError } from '@/utils/loggers.js';
/* components */
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
      let res;
      try {
        res = await this.$axios.get('/common');
        this.$store.commit('M_COMMON_WEBSITES', res.data);
        logInfo(res.data);
      } catch (e) {
        this.$error('failed to fetch common data');
        logError(e);
      }
    },
  },
  async mounted() {
    await this.fetchCommon();
  },
};
</script>
