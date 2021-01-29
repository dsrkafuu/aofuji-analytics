<template>
  <div class="website">
    <GHeader text="Website">
      <GButton @click="handleAdd"><GIconPlus /></GButton>
    </GHeader>
    <GList :data="websites" control type="extend" @edit="handleEdit" @delete="handleDelete"></GList>
  </div>
</template>

<script>
/* utils */
import { logInfo, logError } from '@/utils/loggers.js';

export default {
  name: 'Website',
  computed: {
    websites() {
      const ret = [];
      const websites = this.$store.state.WEBSITE.websites;
      if (websites && Array.isArray(websites)) {
        for (let i = 0; i < websites.length; i++) {
          const site = {};
          site.id = websites[i]._id;
          site.text = websites[i].name;
          site.sub = websites[i].url;
          site.label = websites[i].isPublic ? 'public' : 'private';
          ret.push(site);
        }
      }
      return ret;
    },
  },
  methods: {
    /**
     * fetch website data when first mounted
     */
    async fetchWebsites() {
      let res;
      try {
        res = await this.$axios.get('/admin/website');
        this.$store.commit('UPDATE_ALL_WEBSITES', { data: res.data });
        logInfo(res.data);
      } catch (e) {
        this.$error('failed to fetch website list');
        logError(e);
      }
    },
    /**
     * handle website add
     */
    handleAdd() {
      this.$store.commit('EDIT_WEBSITE', {});
    },
    /**
     * handle website edit
     * @param {string} id
     */
    handleEdit(id) {
      this.$store.commit('EDIT_WEBSITE', { _id: id });
    },
    /**
     * handle website delete
     */
    async handleDelete(id) {
      try {
        await this.$axios.delete(`/admin/website/${id}`);
        this.$store.commit('REMOVE_WEBSITE', { _id: id });
        this.$info('website removed');
      } catch (e) {
        this.$error('failed to remove website');
        logError(e);
      }
    },
  },
  async mounted() {
    await this.fetchWebsites();
  },
};
</script>

<style lang="scss">
.website {
  margin: $space-lg;
}
</style>
