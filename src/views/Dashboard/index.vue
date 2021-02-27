<template>
  <div class="dashboard">
    <div class="row row-hero">
      <VCard class="summary">
        <div class="section">
          <div class="ctx ctx-dr">
            <VSelect :map="rangeMap" v-model="range" />
          </div>
        </div>
        <div class="section">
          <div class="title">Page Views</div>
          <div class="ctx ctx-pv">{{ pageViews }}</div>
        </div>
        <div class="section">
          <div class="title">Unique Visitor</div>
          <div class="ctx ctx-uv">{{ uniqueSessions }}</div>
        </div>
        <div class="section">
          <div class="title">Avg. View Time</div>
          <div class="ctx ctx-pvt">{{ pageViewTime }}</div>
        </div>
      </VCard>
      <VCard class="chart">
        <DashboardChart :pvsData="pageViewSteps" :ussData="uniqueSessionSteps" />
      </VCard>
    </div>
    <div class="row row-prim">
      <VCard class="data section">
        <div class="title">Pages</div>
        <VList class="ctx ctx-path" type="dense" :data="pathnames" />
      </VCard>
      <VCard class="data section">
        <div class="title">Referers</div>
        <VList class="ctx ctx-ref" type="dense" :data="referrers" />
      </VCard>
    </div>
    <div class="row row-norm">
      <VCard class="data section">
        <div class="title">Systems</div>
        <VList class="ctx ctx-sys" type="dense" :data="systems" />
      </VCard>
      <VCard class="data section">
        <div class="title">Browsers</div>
        <VList class="ctx ctx-brow" type="dense" :data="browsers" />
      </VCard>
      <VCard class="data section">
        <div class="title">Device Platforms</div>
        <VList class="ctx ctx-plat" type="dense" :data="platforms" />
      </VCard>
    </div>
    <div class="row row-norm">
      <VCard class="data section">
        <div class="title">Languages</div>
        <VList class="ctx ctx-lang" type="dense" :data="languages" />
      </VCard>
      <VCard class="data section">
        <div class="title">Locations</div>
        <VList class="ctx ctx-loc" type="dense" :data="locations" />
      </VCard>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import DashboardChart from './DashboardChart.vue';

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
    rangeValue() {
      return rangeMap[this.range].value * 1000;
    },
    rangeStep() {
      return rangeMap[this.range].step * 1000;
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
    async curWebsite() {
      if (!this.inited) {
        await this.fetchDashboard();
      }
    },
    async range() {
      if (this.inited && this.curWebsite) {
        await this.fetchDashboard();
      }
    },
  },
  async activated() {
    if (!this.inited && this.curWebsite) {
      await this.fetchDashboard();
    }
  },
  methods: {
    /**
     * fetch dashboard data
     */
    async fetchDashboard() {
      await this.$store.dispatch('dashboard/xaFetchAll', {
        _id: this.curWebsite,
        range: this.rangeValue,
        step: this.rangeStep,
      });
    },
  },
};
</script>

<style lang="scss">
.dashboard {
  margin: $space-base;
  display: flex;
  flex-direction: column;
  gap: $space-base;

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

  .row {
    display: flex;
    gap: $space-base;
    height: 22.25rem;
    &-prim {
      .data:first-child {
        flex: 1 1 60%;
      }
      .data:last-child {
        flex: 1 1 40%;
      }
    }
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

  .summary {
    padding: $space-lg;
    flex: 0 0 26%;
    display: flex;
    flex-direction: column;
    gap: $space-base;
  }
  .ctx-dr {
    margin-top: $space-xs !important;
    margin-bottom: $space-sm;
    .v-select {
      width: 100%;
    }
  }

  .ctx-pv,
  .ctx-uv,
  .ctx-pvt {
    font-size: $font-size-xl * 1.5;
    text-align: center;
  }
  .chart {
    flex: 1 1 auto;
    padding: $space-base;
  }
}
</style>
