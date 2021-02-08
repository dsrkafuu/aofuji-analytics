<template>
  <div class="realtime">
    <div class="row row-hero">
      <VCard class="count">
        <div class="section">
          <div class="title">Users Online</div>
          <div class="ctx ctx-uo">{{ uo }}</div>
        </div>
        <div class="section">
          <div class="title">Device Category</div>
          <div class="ctx ctx-dc">
            <canvas ref="dcilm"></canvas>
          </div>
        </div>
      </VCard>
      <VCard class="map">
        <div class="ctx-map">
          <canvas ref="map"></canvas>
        </div>
      </VCard>
    </div>
    <div class="row row-norm">
      <VCard class="data">
        <div class="section">
          <div class="title">Page Views</div>
          <VList class="ctx ctx-pv" type="dense" :data="pv" graph>
            <template v-slot="{ item }">{{ item.value }}</template>
          </VList>
        </div>
      </VCard>
      <VCard class="data">
        <div class="section">
          <div class="title">User Sources</div>
          <VList class="ctx ctx-us" type="dense" :data="us" graph>
            <template v-slot="{ item }">{{ item.value }}</template>
          </VList>
        </div>
      </VCard>
    </div>
  </div>
</template>

<script>
import { Chart, topojson } from '@/utils/Chart.js';
import { cloneDeep } from '@/utils/lodash.js';
import { logInfo, logError } from '@/utils/loggers.js';

export default {
  name: 'Realtime',
  data() {
    return {
      uo: NaN,
      dc: {},
      map: {},
      act: [],
      pv: [],
      us: [],
      worldTopo: null,
    };
  },
  computed: {
    website() {
      return this.$store.state.COMMON.selectedWebsite?._id;
    },
    dcParsed() {
      const { desktop, mobile, tablet, tv } = this.dc;
      const total = desktop + mobile + tablet + tv;
      return {
        Desktop: desktop / total,
        Mobile: mobile / total,
        Tablet: tablet / total,
        TV: tv / total,
      };
    },
    mapParsed() {
      const ret = {};
      const countries = Object.keys(this.map);
      let max = 0;
      countries.forEach((country) => {
        this.map[country] > max && (max = this.map[country]);
      });
      countries.forEach((country) => {
        ret[country] = this.map[country] / max;
      });
      return ret;
    },
  },
  watch: {
    async website() {
      await this.fetchRealtime(this.website);
    },
    async dcParsed() {
      await this.drawDCChart(this.dcParsed);
    },
    async mapParsed() {
      await this.drawMapChart(this.mapParsed);
    },
  },
  methods: {
    /**
     * fetch realtime data
     * @param {string} website website id
     */
    async fetchRealtime(website) {
      let res;
      try {
        res = await this.$api.get(`/metrics/realtime?website=${website}`);
        this.uo = res.data.uo;
        this.dc = res.data.dc;
        this.map = res.data.map;
        this.act = res.data.act;
        res.data.pv.forEach((item) => (item.text = item.key));
        this.pv = res.data.pv;
        res.data.us.forEach((item) => (item.text = item.key));
        this.us = res.data.us;
        logInfo(cloneDeep(res.data));
      } catch (e) {
        this.$error('failed to fetch realtime data');
        logError(e);
      }
    },
    /**
     * fetch world map topojson
     */
    async fetchWorldTopo() {
      let res;
      try {
        res = await this.$axios.get(
          'https://cdn.jsdelivr.net/gh/amzrk2/dsr-cdn@1.0/json/world-110m.min.json'
        );
        const d = res.data;
        const p = topojson.feature(d, d.objects.ne_110m_admin_0_countries).features;
        this.worldTopo = p;
      } catch (e) {
        this.$error('failed to fetch world map data');
        logError(e);
      }
    },
    /**
     * draw device category chart
     * @param {Object} data
     */
    async drawDCChart(data) {
      new Chart(this.$refs.dcilm, {
        type: 'doughnut',
        data: {
          labels: [...Object.keys(data)],
          datasets: [
            {
              data: [...Object.values(data)],
              backgroundColor: [
                'rgba(138, 162, 211, 0.6)',
                'rgba(63, 69, 81, 0.3)',
                'rgba(139, 129, 195, 0.6)',
              ],
              hoverBackgroundColor: [
                'rgba(138, 162, 211, 0.8)',
                'rgba(63, 69, 81, 0.4)',
                'rgba(139, 129, 195, 0.75)',
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          plugins: {
            legend: {
              position: 'bottom',
            },
          },
        },
      });
    },
    /**
     * draw world map
     * @param {Object} data
     */
    async drawMapChart(data) {
      // fetch topp
      if (!this.worldTopo) {
        await this.fetchWorldTopo();
      }
      // update data
      this.worldTopo.forEach((d) => {
        const ISO = d.properties.ISO_A2;
        d.properties.VALUE = data[ISO] || 0;
      });
      // draw chart
      new Chart(this.$refs.map, {
        type: 'choropleth',
        data: {
          labels: this.worldTopo.map((d) => d.properties.NAME),
          datasets: [
            {
              data: this.worldTopo.map((d) => ({ feature: d, value: d.properties.VALUE })),
              borderWidth: 0,
              borderColor: 'rgba(255, 255, 255, 0)',
            },
          ],
        },
        options: {
          devicePixelRatio: (window.devicePixelRatio || 1) * 2, // 2x scale for clearer border
          aspectRatio: 1, // square map
          showOutline: false,
          showGraticule: false, // disable geo grids
          plugins: {
            legend: {
              display: false, // remove unused legend
            },
          },
          scales: {
            xy: {
              projection: 'mercator', // square map
            },
            color: {
              display: false, // no color card
              // color calculator
              // origin value 0-1
              // target alpha channel 0.2-1
              interpolate: (val) => `rgba(138, 162, 211, ${val * 0.8 + 0.2})`,
            },
          },
        },
      });
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
    flex: 0 0 33%;
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
  .map {
    flex: 1 1 auto;
  }

  .ctx-map {
    position: relative;
    top: -3.25rem;
  }

  // data
  .data {
    flex: 0 1 33%;

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
