<template>
  <div class="dashboard">
    <div class="row row-hero">
      <VCard class="summary">
        <div class="section">
          <div class="ctx ctx-dr">
            <VSelect :map="RANGE_MAP" v-model="dataRange" />
          </div>
        </div>
        <div class="section">
          <div class="title">Page Views</div>
          <div class="ctx ctx-pv">{{ views }}</div>
        </div>
        <div class="section">
          <div class="title">Unique Visitor</div>
          <div class="ctx ctx-uv">{{ sess }}</div>
        </div>
        <div class="section">
          <div class="title">Avg. View Time</div>
          <div class="ctx ctx-pvt">{{ pvt }}</div>
        </div>
      </VCard>
      <VCard class="chart">
        <div class="ctx ctx-chart">
          <canvas ref="chart"></canvas>
        </div>
      </VCard>
    </div>
    <div class="row row-prim">
      <VCard class="data section">
        <div class="title">Pages</div>
        <VList class="ctx ctx-path" type="dense" :data="path" />
      </VCard>
      <VCard class="data section">
        <div class="title">Referers</div>
        <VList class="ctx ctx-ref" type="dense" :data="ref" />
      </VCard>
    </div>
    <div class="row row-norm">
      <VCard class="data section">
        <div class="title">Systems</div>
        <VList class="ctx ctx-sys" type="dense" :data="sys" />
      </VCard>
      <VCard class="data section">
        <div class="title">Browsers</div>
        <VList class="ctx ctx-brow" type="dense" :data="brow" />
      </VCard>
      <VCard class="data section">
        <div class="title">Device Platforms</div>
        <VList class="ctx ctx-plat" type="dense" :data="plat" />
      </VCard>
    </div>
    <div class="row row-norm">
      <VCard class="data section">
        <div class="title">Languages</div>
        <VList class="ctx ctx-lang" type="dense" :data="lang" />
      </VCard>
      <VCard class="data section">
        <div class="title">Locations</div>
        <VList class="ctx ctx-loc" type="dense" :data="loc" />
      </VCard>
    </div>
  </div>
</template>

<script>
import { cloneDeep } from '@/utils/lodash.js';
import { logInfo, logError } from '@/utils/loggers.js';
import { Chart } from '@/utils/Chart.js';

const RANGE_MAP = {
  LAST_15M: { text: 'Last 15 Minutes', value: 900, step: 60 },
  LAST_24H: { text: 'Last 24 Hours', value: 86400, step: 3600 },
  LAST_7D: { text: 'Last Week', value: 604800, step: 86400 },
  LAST_30D: { text: 'Last Month', value: 2592000, step: 86400 },
};

export default {
  name: 'Dashboard',
  data() {
    return {
      sess: 0, // unique sessions count
      lang: [],
      brow: [],
      sys: [],
      plat: [],
      loc: [],

      views: 0, // views count
      view: [], // views by step
      usess: [], // unique sessions by step
      path: [],
      ref: [],
      pvt: 0,

      RANGE_MAP,
      dataRange: 'LAST_15M',
      chart: null,
    };
  },
  computed: {
    website() {
      return this.$store.state.COMMON.selectedWebsite?._id;
    },
  },
  watch: {
    async website() {
      await this.fetchDashboard(
        this.website,
        RANGE_MAP[this.dataRange].value,
        RANGE_MAP[this.dataRange].step
      );
      this.initChart(this.view, this.usess);
    },
    async dataRange() {
      await this.fetchDashboard(
        this.website,
        RANGE_MAP[this.dataRange].value,
        RANGE_MAP[this.dataRange].step
      );
      this.updateChart(this.view, this.usess);
    },
  },
  methods: {
    /**
     * fetch dashboard data
     * @param {string} website website id
     * @param {number} hours
     * @param {number} step
     */
    async fetchDashboard(website, hours, step) {
      const to = 1612846952100; // Date.now();
      step = step * 1000;
      const from = to - hours * 1000;
      let res;
      try {
        res = await this.$api.get(
          `/metrics/dashboard?website=${website}&from=${from}&to=${to}&step=${step}`
        );
        logInfo(cloneDeep(res.data));
        this.sess = res.data.sess;
        this.lang = res.data.lang;
        this.brow = res.data.brow;
        this.sys = res.data.sys;
        this.plat = res.data.plat;
        this.loc = res.data.loc;
        this.views = res.data.views;
        this.view = res.data.view;
        this.usess = res.data.usess;
        this.path = res.data.path;
        this.ref = res.data.ref;
        this.pvt = res.data.pvt;
      } catch (e) {
        this.$error('failed to fetch dashboard data');
        logError(e);
      }
    },
    /**
     * init data chart
     * @param {Array} view views by step
     * @param {Array} usess unique sessions by step
     */
    initChart(view, usess) {
      this.chart = new Chart(this.$refs.chart, {
        type: 'bar',
        data: {
          labels: view.map((val, index) => `${index}`),
          datasets: [
            { label: 'Unique Sessions', data: usess, backgroundColor: '#aba4d3' },
            { label: 'Page Views', data: view, backgroundColor: '#9db1da' },
          ],
        },
        options: {
          devicePixelRatio: (window.devicePixelRatio || 1) * 2,
          maintainAspectRatio: false,
          scales: {
            x: { gridLines: { display: false }, stacked: true },
          },
          plugins: {
            legend: { position: 'bottom' },
          },
        },
      });
    },
    /**
     * update chart data
     * @param {Array} view views by step
     * @param {Array} usess unique sessions by step
     */
    updateChart(view, usess) {
      if (this.chart) {
        this.chart.data.labels = view.map((val, index) => `${index}`);
        this.chart.data.datasets = [
          { data: usess, backgroundColor: '#aba4d3' },
          { data: view, backgroundColor: '#9db1da' },
        ];
        this.chart.update();
      }
    },
  },
  activated() {
    console.log(this.website);
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
  .ctx-chart {
    height: 100%;
  }
}
</style>
