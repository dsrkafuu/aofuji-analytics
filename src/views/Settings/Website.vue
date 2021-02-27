<template>
  <div class="website">
    <VHeader text="Website">
      <VButton @click="handleAdd">
        <VIconPlus />
      </VButton>
    </VHeader>
    <VList :data="websites" control type="extend" @edit="handleEdit" @delete="handleDelete"></VList>
  </div>
</template>

<script>
export default {
  name: 'Website',
  computed: {
    websites() {
      const ret = [];
      const websites = this.$store.state.settings.websites;
      if (websites && Array.isArray(websites)) {
        for (let i = 0; i < websites.length; i++) {
          ret.push({
            id: websites[i]._id,
            text: websites[i].name,
            sub: websites[i].url,
            label: websites[i].isPublic ? 'public' : 'private',
          });
        }
      }
      return ret;
    },
  },
  async mounted() {
    await this.fetchWebsites();
  },
  methods: {
    /**
     * fetch website data when first mounted
     */
    async fetchWebsites() {
      await this.$store.dispatch('settings/xaFetchWebsites');
    },
    /**
     * handle website add
     */
    handleAdd() {
      this.$store.commit('settings/xmSetEditWebsite', { _id: '' });
    },
    /**
     * handle website edit
     * @param {string} _id
     */
    handleEdit(_id) {
      this.$store.commit('settings/xmSetEditWebsite', { _id });
    },
    /**
     * handle website delete
     * @param {string} _id
     */
    async handleDelete(_id) {
      await this.$store.dispatch('settings/xaDeleteWebsite', { _id });
    },
  },
};
</script>

<style lang="scss" scoped>
.website {
  margin: $space-lg;
}
</style>
