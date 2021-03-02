<template>
  <div class="realtime">
    <div class="row row-hero">
      <ACard class="count">
        <AStatistic title="Active Users" :value="activeUsers" :loading="!inited" />
        <RealtimeDeviceCategory :data="deviceCategorys" :loading="!inited" />
      </ACard>
      <ACard class="map">
        <RealtimeMap :data="userRegions" :loading="!inited" />
      </ACard>
    </div>
    <div class="row row-norm">
      <ACard class="data">
        <AStatlist title="Page Views" :data="pageViews" :loading="!inited" />
      </ACard>
      <ACard class="data">
        <AStatlist title="User Events" :data="userEvents" :loading="!inited" />
      </ACard>
      <ACard class="data">
        <AStatlist title="User Regions" :data="userRegions" :loading="!inited" />
      </ACard>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import RealtimeDeviceCategory from './RealtimeDeviceCategory.vue';
import RealtimeMap from './RealtimeMap.vue';

export default {
  name: 'Realtime',
  components: {
    RealtimeDeviceCategory,
    RealtimeMap,
  },

  computed: {
    curWebsite() {
      return this.$store.state.common.curWebsite?._id;
    },
    ...mapState('realtime', [
      'inited',
      'activeUsers',
      'deviceCategorys',
      'pageViews',
      'userEvents',
      'userRegions',
    ]),
  },
  watch: {
    // fetch data when website changed
    async curWebsite(_id) {
      // fix missing route query
      if (this.$route.query.website !== _id) {
        this.$router.replace({ query: { website: _id } });
      }
      await this.fetchRealtime(_id);
    },
  },

  async mounted() {
    if (!this.inited && this.curWebsite) {
      await this.fetchRealtime(this.curWebsite);
    }
  },

  methods: {
    /**
     * fetch realtime data
     * @param {string} _id
     */
    async fetchRealtime(_id) {
      await this.$store.dispatch('realtime/xaFetchAll', { _id });
    },
  },
};
</script>

<style lang="scss" scoped>
.realtime {
  margin: $space-base;
  display: flex;
  flex-direction: column;
  gap: $space-base;
}

.row {
  display: flex;
  gap: $space-base;
  height: $realtime-data-height;

  &-hero {
    height: $realtime-hero-height;
  }
}

.count {
  padding: $space-lg;
  flex: 0 0 28%;
  display: flex;
  flex-direction: column;
  gap: $space-lg;
}

.map {
  flex: 1 1 auto;
}

.data {
  flex: 0 1 32.3%;

  .a-statlist {
    height: $realtime-data-height;
  }
}
</style>
