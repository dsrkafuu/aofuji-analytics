<template>
  <div class="edit">WebsiteEdit id: {{ id }}</div>
</template>

<script>
/* utils */
import { logInfo, logError } from '../../utils/logger.js';

export default {
  name: 'WebsiteEdit',
  computed: {
    id() {
      return this.$store.state.editing.id;
    },
  },
  methods: {
    /**
     * fetch website data with id when activated
     * @param {string} id
     */
    async fetchWebsite(id) {
      let res;
      try {
        res = await this.$axios.get(`/website/${id}`);
      } catch (e) {
        this.$error('failed to fetch websites');
        logError('failed to fetch websites', e);
        res = null;
      }
      console.log(res);
    },
  },
  async activated() {
    // if editing instead of creating
    if (this.id) {
      await this.fetchWebsite(this.id);
      logInfo('website info initialized');
    }
  },
};
</script>

<style lang="scss">
.edit {
}
</style>
