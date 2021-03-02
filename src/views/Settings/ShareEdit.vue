<template>
  <div class="share-edit">
    <VHeader text="Create Share">
      <VButton @click="handleExit">
        <VIconTimes />
      </VButton>
      <VButton @click="handleCheck" :loading="awaitingCheck">
        <VIconCheck />
      </VButton>
    </VHeader>
    <div class="line">
      <span class="keyname">Website</span>
      <VSelect :map="websitesMap" v-model="website" />
    </div>
    <div class="line">
      <span class="keyname">Expire</span>
      <VSelect :map="expireMap" v-model="expire" />
    </div>
  </div>
</template>

<script>
const expireMap = {
  EXPIRE_1H: { text: '1 Hour', value: 3600 },
  EXPIRE_24H: { text: '24 Hours', value: 86400 },
  EXPIRE_7D: { text: '7 Days', value: 604800 },
  EXPIRE_30D: { text: '30 Days', value: 2592000 },
  EXPIRE_NEVER: { text: 'Never', value: -1 },
};

export default {
  name: 'ShareEdit',

  data() {
    return {
      website: (this.$store.state.common.websites || [])[0]?._id || '',
      expireMap,
      expire: 'EXPIRE_NEVER',

      awaitingCheck: false,
    };
  },
  computed: {
    websitesMap() {
      const websites = this.$store.state.common.websites || [];
      const map = {};
      websites.forEach((val) => {
        map[val._id] = { text: val.name };
      });
      return map;
    },
  },

  deactivated() {
    // clear data when exit
    this.website = '';
    this.expire = 'EXPIRE_NEVER';

    this.awaitingCheck = false;
  },

  methods: {
    /**
     * add a new share
     */
    async handleCheck() {
      if (this.website) {
        this.awaitingCheck = true;
        const expDur = expireMap[this.expire].value;
        await this.$store.dispatch('settings/xaPostShare', {
          _website: this.website,
          expire: expDur > 0 ? Date.now() + expDur * 1000 : -1,
        });
        this.awaitingCheck = false;
      }
      this.handleExit();
    },
    /**
     * exit editing
     */
    handleExit() {
      this.$store.commit('settings/xmSetEditShare', {});
    },
  },
};
</script>

<style lang="scss" scoped>
.share-edit {
  padding: $space-lg;
}

.line {
  display: flex;
  align-items: center;
  padding: 0 $space-sm;

  .v-label,
  .v-input {
    margin: 0 !important;
    min-width: 20rem;
    text-align: left;
  }

  .v-label {
    font-size: $font-size-sm;
    height: 2rem;
    line-height: 2rem;
    padding: 0 $space-xs * 1.75;
  }
}

.keyname {
  font-weight: 500;
  height: 2.5rem;
  line-height: 2.5rem;
  width: 10rem;
}
</style>
