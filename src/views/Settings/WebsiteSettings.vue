<template>
  <div class="website-settings">
    <GList :data="data" control type="extend" @edit="handleEdit"></GList>
  </div>
</template>

<script>
/* utils */
import { logInfo, logError } from '../../utils/logger.js';
import { SETTING_TYPES } from '../../utils/constants.js';
const { WEBSITE } = SETTING_TYPES;
/* components */
import GList from '../../components/GList.vue';

export default {
  name: 'WebsiteSettings',
  components: {
    GList,
  },
  data() {
    return {
      data: [],
    };
  },
  methods: {
    /**
     * fetch websites data when first mounted
     */
    async fetchWebsites() {
      let res;
      try {
        res = await this.$axios.get('/websites');
      } catch (e) {
        this.$error(`failed to fetch websites`);
        logError(`failed to fetch websites`, e);
        res = null;
      }
      if (res && Array.isArray(res.data)) {
        for (let i = 0; i < res.data.length; i++) {
          const site = res.data[i];
          site.id = site._id;
          site.text = site.name;
          site.sub = site.domain;
          site.label = site.isPublic ? 'public' : 'private';
        }
        this.data = res.data;
      }
    },
    /**
     * handle website edit
     * @param {string} id
     */
    handleEdit(id) {
      this.$store.dispatch('EDIT_SETTING', { type: WEBSITE, id });
    },
  },
  async mounted() {
    await this.fetchWebsites();
    logInfo('websites data initialized');
  },
};
</script>

<style lang="scss">
.website-settings {
  margin: $space-base;
}
</style>
