<template>
  <div class="dashboard">
    <div class="row row-hero">
      <VCard class="summary">
        <div class="section">
          <div class="title">Page Views</div>
          <div class="ctx ctx-pv">{{ pv }}</div>
        </div>
        <div class="section">
          <div class="title">Unique Visitor</div>
          <div class="ctx ctx-uv">{{ uv }}</div>
        </div>
        <div class="section">
          <div class="title">Avg. View Time</div>
          <div class="ctx ctx-pvt">{{ pvt }}</div>
        </div>
      </VCard>
      <VCard class="chart"> </VCard>
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

export default {
  name: 'Dashboard',
  data() {
    return {
      vsum: [],
      ssum: [],
      pvt: NaN,
      path: [],
      ref: [],
      sys: [],
      brow: [],
      plat: [],
      lang: [],
      loc: [],
    };
  },
  computed: {
    // total page view
    pv() {
      return this.vsum.reduce((preVal, curVal) => preVal + curVal, 0);
    },
    // total unique visitor
    uv() {
      return this.ssum.reduce((preVal, curVal) => preVal + curVal, 0);
    },
    website() {
      return this.$store.state.COMMON.selectedWebsite?._id;
    },
  },
  watch: {
    async website() {
      await this.fetchDashboard(this.website);
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
        this.vsum = res.data.vsum;
        this.ssum = res.data.ssum;
        this.pvt = res.data.pvt;
        this.path = res.data.path;
        this.ref = res.data.ref;
        this.sys = res.data.sys;
        this.brow = res.data.brow;
        this.plat = res.data.plat;
        this.lang = res.data.lang;
        this.loc = res.data.loc;
      } catch (e) {
        this.$error('failed to fetch dashboard data');
        logError(e);
      }
    },
    /**
     * draw data chart
     * @param {Array} ssum
     * @param {Array} vsum
     */
    async drawChart(ssum, vsum) {
      console.log(ssum, vsum);
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
    height: 22rem;

    &-hero {
      height: 19rem;
    }

    &-prim {
      .data {
        flex: 1 1 auto;
      }
    }
  }

  .summary {
    padding: $space-lg;
    flex: 0 0 26%;
    display: flex;
    flex-direction: column;
    gap: $space-lg;
  }

  .ctx-pv,
  .ctx-uv,
  .ctx-pvt {
    font-size: $font-size-xl * 1.5;
    text-align: center;
  }

  .chart {
    flex: 1 1 auto;
  }
}
</style>
