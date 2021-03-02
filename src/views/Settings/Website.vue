<template>
  <div class="website">
    <AHeader text="Website">
      <AButton @click="handleAdd">
        <AIconPlus />
      </AButton>
    </AHeader>
    <div class="content">
      <ALoading :loading="loading" :nodata="nodata" />
      <AList :data="websites" type="extend" custom v-slot="{ item }">
        <div class="a-list-ctrl">
          <div class="a-list-ctrl-item">
            <AButton @click="handleShowCode(item.id)">
              <AIconCode />
            </AButton>
          </div>
          <div class="a-list-ctrl-item">
            <AButton @click="handleEdit(item.id)">
              <AIconEdit />
            </AButton>
          </div>
          <div class="a-list-ctrl-item">
            <AButton @click="handleDelete(item.id)" :loading="item.id === awaitingDelete">
              <AIconTrash />
            </AButton>
          </div>
        </div>
      </AList>
    </div>
    <AModal type="alert" :show="Boolean(showCodeID)" @confirm="handleCloseCode" custom>
      <div class="code">
        <pre class="code-pre" v-text="fmtCode(showCodeID)"></pre>
      </div>
    </AModal>
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
      awaitingDelete: '',

      loading: true,
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
          });
        }
      }
      return ret;
    },
    nodata() {
      return this.websites.length <= 0;
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
      this.loading = true;
      await this.$store.dispatch('settings/xaFetchWebsites');
      this.loading = false;
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
      this.awaitingDelete = _id;
      await this.$store.dispatch('settings/xaDeleteWebsite', { _id });
      this.awaitingDelete = '';
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
  padding: $space-lg;
}

.content {
  position: relative;
  min-height: 3rem;

  .a-list-ctrl {
    flex: 0 0 auto;
    display: flex;
    width: 12rem;
    justify-content: center;
  }
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
</style>
