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
    fmtNumber,
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

  .section {
    height: $realtime-data-height;
    display: flex;
    flex-direction: column;
  }
  .title {
    padding: $space-lg;
    padding-bottom: 0;
  }
  .ctx {
    flex: 1 1 auto;
    padding: $space-xs $space-sm;
    padding-bottom: $space-base;
    position: relative;
  }
}
</style>
