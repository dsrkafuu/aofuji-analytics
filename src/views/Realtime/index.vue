<template>
  <div class="realtime">
    <div class="row row-hero">
      <VCard class="count">
        <div class="section">
          <div class="title">Active Users</div>
          <div class="ctx ctx-au">{{ fmtNumber(activeUsers) }}</div>
        </div>
        <RealtimeDeviceCategory :data="deviceCategorys" />
      </VCard>
      <VCard class="map">
        <RealtimeMap :data="userRegions" />
      </VCard>
    </div>
    <div class="row row-norm">
      <VCard class="data">
        <div class="section">
          <div class="title">Page Views</div>
          <VList class="ctx ctx-pv" type="dense" :data="pageViews" />
        </div>
      </VCard>
      <VCard class="data">
        <div class="section">
          <div class="title">User Events</div>
          <VList class="ctx ctx-ue" type="dense" :data="userEvents" />
        </div>
      </VCard>
      <VCard class="data">
        <div class="section">
          <div class="title">User Regions</div>
          <VList class="ctx ctx-ur" type="dense" :data="userRegions" />
        </div>
      </VCard>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import RealtimeDeviceCategory from './RealtimeDeviceCategory.vue';
import RealtimeMap from './RealtimeMap.vue';
import { fmtNumber } from '@/utils/formatters';

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
    async curWebsite() {
      // fix missing route query
      if (this.$route.query.website !== this.curWebsite) {
        this.$router.replace({ query: { website: this.curWebsite } });
      }
      if (!this.inited) {
        await this.fetchRealtime();
      }
    },
  },
  async activated() {
    // fetch data when router push in
    if (!this.inited && this.curWebsite) {
      await this.fetchRealtime();
    }
  },
  methods: {
    fmtNumber,
    /**
     * fetch realtime data
     */
    async fetchRealtime() {
      await this.$store.dispatch('realtime/xaFetchAll', { _id: this.curWebsite });
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
  height: 22.25rem;
  &-hero {
    height: 26rem;
  }
}

.title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ctx {
  margin-top: $space-sm;

  &-au {
    font-size: $font-size-xl * 1.5;
    text-align: center;
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

  .title {
    padding: $space-lg;
    padding-bottom: 0;
  }
  .ctx {
    padding: $space-xs $space-sm;
    padding-bottom: $space-base;
  }
}
</style>
