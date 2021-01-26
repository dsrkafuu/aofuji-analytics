<template>
  <div class="website-settings">
    <GHeader text="website settings">
      <GButton @click="handleAdd"><GIconPlus /></GButton>
    </GHeader>
    <GList :data="websites" control type="extend" @edit="handleEdit" @delete="handleDelete"></GList>
  </div>
</template>

<script>
/* utils */
import { logInfo, logError } from '../../utils/loggers.js';

export default {
  name: 'WebsiteSettings',
  computed: {
    websites() {
      const ret = [];
      const websites = this.$store.state.WEBSITE.websites;
      if (websites && Array.isArray(websites)) {
        for (let i = 0; i < websites.length; i++) {
          const site = {};
          site.id = websites[i]._id;
          site.text = websites[i].name;
          site.sub = websites[i].domain;
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
      let res, buf;
      try {
        res = await this.$axios.get('/website');
        this.$store.commit('UPDATE_ALL_WEBSITES', { data: res.data });
        buf = 'website list initialized';
        logInfo(buf);
      } catch (e) {
        buf = 'failed to fetch website list';
        this.$error(buf);
        logError(buf, e);
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
      let buf;
      try {
        await this.$axios.delete(`/website/${id}`);
        this.$store.commit('REMOVE_WEBSITE', { _id: id });
        buf = 'website removed';
        this.$info(buf);
        logInfo(buf, id);
      } catch (e) {
        buf = 'failed to remove website';
        this.$error(buf);
        logError(buf, e);
      }
    },
  },
  async mounted() {
    await this.fetchWebsites();
  },
};
</script>

<style lang="scss">
.website-settings {
  margin: $space-lg;
}
</style>
