<template>
  <div class="dashboard">
    <div class="row row-hero">
      <VCard class="summary">
        <div class="section">
          <div class="ctx ctx-rg">
            <VSelect :map="rangeMap" v-model="range" />
          </div>
        </div>
        <div class="section">
          <div class="title">Page Views</div>
          <div class="ctx ctx-pv">{{ fmtNumber(pageViews) }}</div>
        </div>
        <div class="section">
          <div class="title">Unique Visitors</div>
          <div class="ctx ctx-us">{{ fmtNumber(uniqueSessions) }}</div>
        </div>
        <div class="section">
          <div class="title">Avg. View Time</div>
          <div class="ctx ctx-pvt">{{ fmtTime(pageViewTime) }}</div>
        </div>
      </VCard>
      <VCard class="chart">
        <DashboardChart :pvsData="pageViewSteps" :ussData="uniqueSessionSteps" :loading="!inited" />
      </VCard>
    </div>
    <div class="row row-prim">
      <VCard class="data">
        <div class="section">
          <div class="title">Pages</div>
          <VList class="ctx ctx-path" type="dense" :data="pathnames" :loading="!inited" />
        </div>
      </VCard>
      <VCard class="data">
        <div class="section">
          <div class="title">Referers</div>
          <VList class="ctx ctx-ref" type="dense" :data="referrers" :loading="!inited" />
        </div>
      </VCard>
    </div>
    <div class="row row-norm">
      <VCard class="data">
        <div class="section">
          <div class="title">Systems</div>
          <VList class="ctx ctx-sys" type="dense" :data="systems" :loading="!inited" />
        </div>
      </VCard>
      <VCard class="data">
        <div class="section">
          <div class="title">Browsers</div>
          <VList class="ctx ctx-brow" type="dense" :data="browsers" :loading="!inited" />
        </div>
      </VCard>
      <VCard class="data">
        <div class="section">
          <div class="title">Device Platforms</div>
          <VList class="ctx ctx-plat" type="dense" :data="platforms" :loading="!inited" />
        </div>
      </VCard>
    </div>
    <div class="row row-norm">
      <VCard class="data">
        <div class="section">
          <div class="title">Languages</div>
          <VList class="ctx ctx-lang" type="dense" :data="languages" :loading="!inited" />
        </div>
      </VCard>
      <VCard class="data">
        <div class="section">
          <div class="title">Locations</div>
          <VList class="ctx ctx-loc" type="dense" :data="locations" :loading="!inited" />
        </div>
      </VCard>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import DashboardChart from './DashboardChart.vue';
import { fmtNumber, fmtTime } from '@/utils/formatters';

const rangeMap = {
  LAST_15M: { text: 'Last 15 Minutes', value: 900, step: 60 },
  LAST_24H: { text: 'Last 24 Hours', value: 86400, step: 3600 },
  LAST_7D: { text: 'Last Week', value: 604800, step: 86400 },
  LAST_30D: { text: 'Last Month', value: 2592000, step: 86400 },
};

export default {
  name: 'Dashboard',
  components: {
    DashboardChart,
  },

  data() {
    return {
      rangeMap,
      range: 'LAST_15M',
    };
  },
  computed: {
    curWebsite() {
      return this.$store.state.common.curWebsite?._id;
    },
    ...mapState('dashboard', [
      'inited',
      'pageViews',
      'uniqueSessions',
      'pageViewTime',
      'pageViewSteps',
      'uniqueSessionSteps',
      'pathnames',
      'referrers',
      'languages',
      'browsers',
      'systems',
      'platforms',
      'locations',
    ]),
  },
  watch: {
    async curWebsite(_id) {
      // fix missing route query
      if (this.$route.query.website !== _id) {
        this.$router.replace({ query: { website: _id } });
      }
      await this.fetchDashboard(
        _id,
        rangeMap[this.range].value * 1000,
        rangeMap[this.range].step * 1000
      );
    },
    async range(key) {
      if (this.inited && this.curWebsite) {
        this.$store.commit('dashboard/xmSetInited', { value: false });
        await this.fetchDashboard(
          this.curWebsite,
          rangeMap[key].value * 1000,
          rangeMap[key].step * 1000
        );
      }
    },
  },

  async mounted() {
    if (!this.inited && this.curWebsite) {
      await this.fetchDashboard(
        this.curWebsite,
        rangeMap[this.range].value * 1000,
        rangeMap[this.range].step * 1000
      );
    }
  },

  methods: {
    fmtNumber,
    fmtTime,
    /**
     * fetch dashboard data
     * @param {string} _id
     * @param {number} range
     * @param {number} step
     */
    async fetchDashboard(_id, range, step) {
      await this.$store.dispatch('dashboard/xaFetchAll', { _id, range, step });
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  margin: $space-base;
  display: flex;
  flex-direction: column;
  gap: $space-base;

  .row {
    display: flex;
    gap: $space-base;
    height: $dashboard-data-height;

    &-prim {
      .data:first-child {
        flex: 1 1 60%;
      }
      .data:last-child {
        flex: 1 1 40%;
      }
    }
  }

  .title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .ctx {
    margin-top: $space-sm;
    position: relative;

    &-rg {
      margin-top: $space-xs !important;
      margin-bottom: $space-sm;
      .v-select {
        width: 100%;
      }
    }

    &-pv,
    &-us,
    &-pvt {
      font-size: $font-size-xl * 1.5;
      text-align: center;
    }
  }

  .data {
    flex: 0 1 32.3%;

    .section {
      display: flex;
      height: $realtime-data-height;
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

  .summary {
    padding: $space-lg;
    flex: 0 0 26%;
    display: flex;
    flex-direction: column;
    gap: $space-base;
  }
  .chart {
    flex: 1 1 auto;
    padding: $space-base;
  }
}
</style>
