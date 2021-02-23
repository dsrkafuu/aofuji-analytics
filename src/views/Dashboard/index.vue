<template>
  <div class="dashboard">
    <div class="row row-hero">
      <VCard class="summary">
        <div class="section">
          <div class="ctx ctx-dr">
            <VSelect :data="rangeMap" v-model="dataRange" />
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

const rangeMap = [
  { text: 'Last 24 Hours', value: 24, step: 1 },
  { text: 'Last Week', value: 168, step: 24 },
  { text: 'Last Month', value: 672, step: 24 },
];

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

      rangeMap,
      dataRange: 168,
    };
  },
  computed: {
    website() {
      return this.$store.state.COMMON.selectedWebsite?._id;
    },
  },
  watch: {
    async website() {
      await this.fetchDashboard(this.website);
      await this.drawChart(this.view, this.usess);
    },
  },
  methods: {
    /**
     * fetch dashboard data
     * @param {string} website website id
     */
    async fetchDashboard(website) {
      let res;
      try {
        const now = Date.now();
        const step = 24 * 60 * 60 * 1000; // 1day
        const from = now - 7 * step; // 1week
        res = await this.$api.get(
          `/metrics/dashboard?website=${website}&from=${from}&to=${now}&step=${step}`
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
     * draw data chart
     * @param {Array} view views by step
     * @param {Array} usess unique sessions by step
     */
    async drawChart(view, usess) {
      new Chart(this.$refs.chart, {
        type: 'bar',
        data: {
          labels: view.map((val, index) => `${index}`),
          datasets: [
            { data: usess, backgroundColor: 'rgba(139, 129, 195, 0.4)' },
            { data: view, backgroundColor: 'rgba(138, 162, 211, 0.8)' },
          ],
        },
        options: {
          devicePixelRatio: (window.devicePixelRatio || 1) * 2,
          maintainAspectRatio: false,
          scales: {
            x: { gridLines: { display: false }, stacked: true },
          },
          plugins: {
            legend: { display: false },
          },
        },
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

    .ctx-dr {
      margin-top: $space-xs;
      margin-bottom: $space-sm;

      .v-select {
        width: 100%;
      }
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
