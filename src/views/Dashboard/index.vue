<template>
  <div class="dashboard">dashboard</div>
</template>

<script>
import { cloneDeep } from '@/utils/lodash.js';
import { logInfo, logError } from '@/utils/loggers.js';

export default {
  name: 'Dashboard',
  computed: {
    website() {
      return this.$store.state.COMMON.selectedWebsite?._id;
    },
  },
  watch: {
    async website() {
      await this.fetchDashboard(this.website);
    },
  },
  methods: {
    /**
     * fetch dashboard data
     * @param {string} website website id
     */
    async fetchDashboard(website) {
      let res;
      try {
        const now = Date.now();
        const step = 24 * 60 * 60 * 1000; // 1day
        const from = now - 7 * step; // 1week
        res = await this.$api.get(
          `/metrics/dashboard?website=${website}&from=${from}&to=${now}&step=${step}`
        );
        logInfo(cloneDeep(res.data));
      } catch (e) {
        this.$error('failed to fetch dashboard data');
        logError(e);
      }
    },
  },
};
</script>
