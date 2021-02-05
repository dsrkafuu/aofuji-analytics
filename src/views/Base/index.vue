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
        // init default selected website
        if (res.data[0]) {
          this.$store.commit('M_SELECT_WEBSITE', res.data[0]);
          // update url search param
          if (!this.$route.query.website) {
            this.$router.replace({
              query: { website: res.data[0]._id },
            });
          }
        }
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
