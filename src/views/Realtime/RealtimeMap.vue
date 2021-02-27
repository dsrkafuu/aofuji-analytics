<template>
  <div class="section">
    <div class="ctx ctx-map">
      <canvas ref="mapRef"></canvas>
    </div>
  </div>
</template>

<script>
import { CHART_MAP_TOPOJSON, CHART_MAP_PIXEL_RATIO } from '@/utils/constants';
import { Chart, topojson } from '@/utils/chart';
import { fromPairs } from '@/utils/lodash';

export default {
  name: 'RealtimeMap',
  props: {
    data: { type: Array },
  },
  data() {
    return {
      topojson: null, // map basic topojson data
      topoStatus: null, // topojson init status
      chart: null,
    };
  },
  watch: {
    data(data) {
      if (this.chart) {
        this.updateMap(data);
      } else {
        this.drawMap(data);
      }
    },
  },
  mounted() {
    const fetchPromise = this.fetchTopojson();
    this.topoStatus = fetchPromise;
  },
  methods: {
    /**
     * fetch world map topojson
     */
    async fetchTopojson() {
      const res = await this.$axios.get(CHART_MAP_TOPOJSON);
      const data = res.data;
      const parsed = topojson.feature(data, data.objects.ne_110m_admin_0_countries).features;
      this.topojson = parsed;
    },
    /**
     * draw world map, need to init `this.topojson` first
     * @param {Array} data user regions data
     */
    async drawMap(data) {
      // wait for topojson fetched
      await this.topoStatus;
      // combine user regions data with topojson
      const regions = fromPairs(data);
      this.topojson.forEach((d) => {
        const ISO = d.properties.ISO_A2;
        d.properties.VALUE = regions[ISO] || null;
      });
      // draw chart
      this.chart = new Chart(this.$refs.mapRef, {
        type: 'choropleth',
        data: {
          labels: this.topojson.map((d) => d.properties.NAME),
          datasets: [
            {
              data: this.topojson.map((d) => ({ feature: d, value: d.properties.VALUE })),
              borderWidth: 0,
              borderColor: '#ffffff00',
            },
          ],
        },
        options: {
          devicePixelRatio: (window.devicePixelRatio || 1) * CHART_MAP_PIXEL_RATIO,
          aspectRatio: 1, // square map
          showOutline: false,
          showGraticule: false, // disable geo grids
          plugins: {
            legend: { display: false }, // remove unused legend
          },
          scales: {
            xy: { projection: 'mercator' }, // square map
            color: {
              display: false, // no color card
              missing: 'rgba(157, 182, 218, 0.5)',
              // color calculator, origin value 0-1
              // target color rgba(157,182,218,0.8)-rgba(157,172,218,1.0)
              interpolate: (val) => {
                return `rgba(157, ${182 - 10 * val}, 218, ${0.8 + val * 0.2})`;
              },
            },
          },
        },
      });
    },
    /**
     * update world map, need to init `this.topojson` first
     * @param {Array} data user regions data
     */
    async updateMap(data) {
      // wait for topojson fetched
      await this.topoStatus;
      // combine user regions data with topojson
      const regions = fromPairs(data);
      this.topojson.forEach((d) => {
        const ISO = d.properties.ISO_A2;
        d.properties.VALUE = regions[ISO] || null;
      });
      // draw chart
      this.chart.data.labels = this.topojson.map((d) => d.properties.NAME);
      this.chart.data.datasets[0].data = this.topojson.map((d) => ({
        feature: d,
        value: d.properties.VALUE,
      }));
      this.chart.update();
    },
  },
};
</script>

<style lang="scss" scoped>
.ctx-map {
  position: relative;
  top: -3.25rem;
}
</style>
