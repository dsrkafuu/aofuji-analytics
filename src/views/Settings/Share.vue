<template>
  <div class="share">
    <VHeader text="Share">
      <VButton @click="handleAdd">
        <VIconPlus />
      </VButton>
    </VHeader>
    <div class="content">
      <VLoading :loading="loading" :nodata="nodata" />
      <VList :data="shares" type="extend" custom v-slot="{ item }">
        <div class="v-list-ctrl">
          <div class="v-list-ctrl-item">
            <VButton @click="handleShowLink(item.id)">
              <VIconCode />
            </VButton>
          </div>
          <div class="v-list-ctrl-item">
            <VButton @click="handleDelete(item.id)" :loading="item.id === awaitingDelete">
              <VIconTrash />
            </VButton>
          </div>
        </div>
      </VList>
    </div>
    <VModal type="alert" :show="Boolean(shareLink)" @confirm="handleCloseLink" custom>
      <div class="code">
        <pre class="code-pre" v-text="shareLink"></pre>
      </div>
    </VModal>
  </div>
</template>

<script>
import dayjs from 'dayjs';

export default {
  name: 'Share',

  data() {
    return {
      awaitingDelete: '',
      shareLink: '',

      loading: true,
    };
  },
  computed: {
    shares() {
      const ret = [];
      const shares = this.$store.state.settings.shares;
      if (shares && Array.isArray(shares)) {
        for (let i = 0; i < shares.length; i++) {
          const expire = shares[i].expire;
          ret.push({
            id: shares[i]._id,
            text: shares[i]._website.name,
            sub:
              expire > 0
                ? `Expire at ${dayjs(expire).format('YYYY-MM-DD HH:mm:ss')}`
                : 'Never expire',
            label: expire > 0 ? (expire < Date.now() ? 'expired' : 'active') : 'active',
          });
        }
      }
      return ret;
    },
    nodata() {
      return this.shares.length <= 0;
    },
  },

  async mounted() {
    await this.fetchShare();
  },

  methods: {
    /**
     * fetch sharing data when first mounted
     */
    async fetchShare() {
      this.loading = true;
      await this.$store.dispatch('settings/xaFetchShares');
      this.loading = false;
    },
    /**
     * handle sharing add
     */
    handleAdd() {
      this.$store.commit('settings/xmSetEditShare', { _id: '' });
    },
    /**
     * handle sharing delete
     * @param {string} _id
     */
    async handleDelete(_id) {
      this.awaitingDelete = _id;
      await this.$store.dispatch('settings/xaDeleteShare', { _id });
      this.awaitingDelete = '';
    },
    /**
     * handle get sharing link
     * @param {string} _id
     */
    handleShowLink(_id) {
      this.shareLink = window.location.origin + '/share/' + _id;
    },
    /**
     * close link modal
     */
    handleCloseLink() {
      this.shareLink = '';
    },
  },
};
</script>

<style lang="scss" scoped>
.share {
  padding: $space-lg;
}

.content {
  position: relative;
  min-height: 3rem;

  .v-list-ctrl {
    flex: 0 0 auto;
    display: flex;
    width: 8rem;
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
