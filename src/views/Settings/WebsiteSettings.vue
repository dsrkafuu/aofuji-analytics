<template>
  <div class="website-settings">
    <GHeader text="website settings">
      <GButton @click="handleAdd"><GIconPlus /></GButton>
    </GHeader>
    <GList :data="data" control type="extend" @edit="handleEdit"></GList>
  </div>
</template>

<script>
/* utils */
import { logInfo, logError } from '../../utils/logger.js';
import { SETTING_TYPES } from '../../utils/constants.js';
const { WEBSITE } = SETTING_TYPES;

export default {
  name: 'WebsiteSettings',
  data() {
    return {
      data: [],
    };
  },
  methods: {
    /**
     * fetch website data when first mounted
     */
    async fetchWebsites() {
      let res;
      try {
        res = await this.$axios.get('/website');
      } catch (e) {
        this.$error('failed to fetch websites');
        logError('failed to fetch websites', e);
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
     * handle website add
     */
    handleAdd() {
      this.$store.dispatch('EDIT_SETTING', { type: WEBSITE });
    },
    /**
     * handle website edit
     * @param {string} id
     */
    handleEdit(id) {
      this.$store.dispatch('EDIT_SETTING', { type: WEBSITE, id });
    },
  },
  async activated() {
    await this.fetchWebsites();
    logInfo('websites initialized');
  },
};
</script>

<style lang="scss">
.website-settings {
  margin: $space-lg;
}
</style>
