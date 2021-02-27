<template>
  <div class="realtime">
    <div class="row row-hero">
      <VCard class="count">
        <div class="section">
          <div class="title">Users Online</div>
          <div class="ctx ctx-uo">{{ activeUsers }}</div>
        </div>
        <RealtimeDeviceCategory :data="deviceCategorys" />
      </VCard>
      <VCard class="realtime-map">
        <RealtimeMap :data="userRegions" />
      </VCard>
    </div>
    <div class="row row-norm">
      <VCard class="data section">
        <div class="title">Page Views</div>
        <VList class="ctx ctx-pv" type="dense" :data="pageViews" />
      </VCard>
      <VCard class="data section">
        <div class="title">User Events</div>
        <VList class="ctx ctx-pe" type="dense" :data="userEvents" />
      </VCard>
      <VCard class="data section">
        <div class="title">User Regions</div>
        <VList class="ctx ctx-ar" type="dense" :data="userRegions" />
      </VCard>
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
    async curWebsite(_id) {
      if (!this.inited) {
        await this.fetchRealtime(_id);
      }
    },
  },
  async activated() {
    if (!this.inited && this.curWebsite) {
      await this.fetchRealtime(this.curWebsite);
    }
  },
  methods: {
    /**
     * fetch realtime data
     * @param {string} _id website id
     */
    async fetchRealtime(_id) {
      await this.$store.dispatch('realtime/xaFetchAll', { _id });
    },
  },
};
</script>

<style lang="scss">
.realtime {
  margin: $space-base;
  display: flex;
  flex-direction: column;
  gap: $space-base;

  .row {
    display: flex;
    gap: $space-base;
    height: 22.25rem;

    &-hero {
      height: 26rem;
    }
  }

  .section {
    .title {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .ctx {
      margin-top: $space-sm;
    }
  }

  // count
  .count {
    padding: $space-lg;
    flex: 0 0 28%;
    display: flex;
    flex-direction: column;
    gap: $space-lg;
  }

  .ctx-uo {
    font-size: $font-size-xl * 1.5;
    text-align: center;
  }

  .ctx-dc {
    padding-top: $space-sm;
    max-width: 14.5rem;
    margin: 0 auto;
  }

  // map
  &-map {
    flex: 1 1 auto;
  }

  // data
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
}
</style>
