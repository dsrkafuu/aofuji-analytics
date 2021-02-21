<template>
  <div class="realtime">
    <div class="row row-hero">
      <VCard class="count">
        <div class="section">
          <div class="title">Users Online</div>
          <div class="ctx ctx-uo">{{ au }}</div>
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
      <VCard class="data section">
        <div class="title">Page Views</div>
        <VList class="ctx ctx-pv" type="dense" :data="pv" />
      </VCard>
      <VCard class="data section">
        <div class="title">User Events</div>
        <VList class="ctx ctx-pe" type="dense" :data="ue" />
      </VCard>
      <VCard class="data section">
        <div class="title">User Regions</div>
        <VList class="ctx ctx-ar" type="dense" :data="ur" />
      </VCard>
    </div>
  </div>
</template>

<script>
import { Chart, topojson } from '@/utils/Chart.js';
import { cloneDeep, fromPairs } from '@/utils/lodash.js';
import { logInfo, logError } from '@/utils/loggers.js';

export default {
  name: 'Realtime',
  data() {
    return {
      au: 0, // active users
      dc: [], // device categories
      pv: [], // page views
      ue: [], // user events
      ur: [], // user regions
      topo: null, // world map topojson
    };
  },
  computed: {
    website() {
      return this.$store.state.COMMON.selectedWebsite?._id;
    },
  },
  watch: {
    async website() {
      // update data
      const fetchWorks = [];
      if (!this.topo) {
        fetchWorks.push(this.fetchWorldTopo());
      }
      fetchWorks.push(this.fetchRealtime(this.website));
      await Promise.all(fetchWorks);
      // draw charts
      await Promise.all([this.drawDC(this.dc), this.drawMap(this.ur)]);
    },
  },
  methods: {
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
        this.topo = p;
      } catch (e) {
        this.$error('failed to fetch world map data');
        logError(e);
      }
    },
    /**
     * fetch realtime data
     * @param {string} website website id
     */
    async fetchRealtime(website) {
      let res;
      try {
        res = await this.$api.get(`/metrics/realtime?website=${website}`);
        logInfo(cloneDeep(res.data));
        this.au = res.data.au;
        this.dc = res.data.dc;
        this.pv = res.data.pv;
        this.ue = res.data.ue;
        this.ur = res.data.ur;
      } catch (e) {
        this.$error('failed to fetch realtime data');
        logError(e);
      }
    },
    /**
     * draw device category chart
     * @param {Array} data
     */
    async drawDC(data) {
      new Chart(this.$refs.dcilm, {
        type: 'doughnut',
        data: {
          labels: [...Object.keys(fromPairs(data))],
          datasets: [
            {
              data: [...Object.values(fromPairs(data))],
              backgroundColor: [
                'rgba(138, 162, 211, 0.6)', // desktop
                'rgba(139, 129, 195, 0.6)', // mobile
                'rgba(63, 69, 81, 0.3)', // tablet
              ],
              hoverBackgroundColor: [
                'rgba(138, 162, 211, 0.6)', // desktop
                'rgba(139, 129, 195, 0.6)', // mobile
                'rgba(63, 69, 81, 0.3)', // tablet
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
     * draw world map, need to init `this.topo` first
     * @param {Array} data user regions
     */
    async drawMap(data) {
      if (!this.topo) {
        return;
      }
      // combine user regions data with topojson
      const ur = fromPairs(data);
      this.topo.forEach((d) => {
        const ISO = d.properties.ISO_A2;
        d.properties.VALUE = ur[ISO] || 0;
      });
      // draw chart
      new Chart(this.$refs.map, {
        type: 'choropleth',
        data: {
          labels: this.topo.map((d) => d.properties.NAME),
          datasets: [
            {
              data: this.topo.map((d) => ({ feature: d, value: d.properties.VALUE })),
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
              missing: 'rgba(138, 162, 211, 0.2)',
              // color calculator
              // origin value 0-1
              // target alpha channel 0.5-0.8
              interpolate: (val) => {
                if (!val) {
                  return 'rgba(138, 162, 211, 0.2)';
                }
                return `rgba(138, 162, 211, ${0.6 * val + 0.2})`;
              },
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
    height: 22rem;

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
  .map {
    flex: 1 1 auto;
  }

  .ctx-map {
    position: relative;
    top: -3.25rem;
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
