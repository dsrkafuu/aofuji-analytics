<template>
  <div class="website">
    <VHeader text="Website">
      <VButton @click="handleAdd">
        <VIconPlus />
      </VButton>
    </VHeader>
    <VList :data="websites" type="extend" custom v-slot="{ item }">
      <div class="v-list-ctrl">
        <div class="v-list-ctrl-item">
          <VButton @click="handleShowCode(item.id)">CODE</VButton>
        </div>
        <div class="v-list-ctrl-item">
          <VButton @click="handleEdit(item.id)">
            <VIconEdit />
          </VButton>
        </div>
        <div class="v-list-ctrl-item">
          <VButton @click="handleDelete(item.id)">
            <VIconTrash />
          </VButton>
        </div>
      </div>
    </VList>
    <VModal type="alert" :show="Boolean(showCodeID)" @confirm="handleCloseCode" custom>
      <div class="code">
        <pre class="code-pre" v-text="fmtCode(showCodeID)"></pre>
      </div>
    </VModal>
  </div>
</template>

<script>
import { fmtCode } from '@/utils/formatters';

export default {
  name: 'Website',
  data() {
    return {
      showCode: false,
      showCodeID: '',
    };
  },
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
    fmtCode,
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
    /**
     * handle get tracker code
     * @param {string} _id
     */
    handleShowCode(_id) {
      this.showCodeID = _id;
    },
    /**
     * close show code modal
     */
    handleCloseCode() {
      this.showCodeID = '';
    },
  },
};
</script>

<style lang="scss" scoped>
.website {
  margin: $space-lg;

  .v-list-ctrl {
    flex: 0 0 auto;
    display: flex;
    width: 12rem;
    justify-content: center;
  }

  .code {
    width: 100%;
    height: 100%;
    margin-bottom: $space-sm;

    &-pre {
      border-radius: $radius;
      font-family: $font-family-mono;
      margin: 0;
      background-color: var(--color-wrapper);
      padding: $space-sm;
      overflow-x: auto;
      font-size: $font-size-sm;
    }
  }
}
</style>
