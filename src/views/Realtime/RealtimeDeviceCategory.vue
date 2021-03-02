<template>
  <div class="realtime-device-category">
    <div class="title">Device Category</div>
    <div class="ctx">
      <ALoading :loading="loading" :nodata="nodata" />
      <canvas ref="deviceCategoryRef"></canvas>
    </div>
  </div>
</template>

<script>
import { CHART_PIXEL_RATIO } from '@/utils/constants';
import { Chart } from '@/utils/chartjs';
import { fromPairs } from '@/utils/lodash';

export default {
  name: 'RealtimeDeviceCategory',

  props: {
    data: { type: Array },
    loading: { type: Boolean },
  },
  data() {
    return {
      chart: null,
    };
  },
  computed: {
    nodata() {
      return this.data.length <= 0;
    },
  },
  watch: {
    async data(data) {
      if (this.chart) {
        await this.updateChart(data);
      } else {
        await this.drawChart(data);
      }
    },
  },

  async mounted() {
    if (!this.nodata) {
      await this.drawChart(this.data);
    }
  },

  methods: {
    /**
     * draw device category chart
     * @param {Array} data
     */
    async drawChart(data) {
      this.chart = new Chart(this.$refs.deviceCategoryRef, {
        type: 'doughnut',
        data: {
          labels: [...Object.keys(fromPairs(data))],
          datasets: [
            {
              data: [...Object.values(fromPairs(data))],
              backgroundColor: ['#9db1da', '#aba4d3', '#ababab'],
              borderWidth: 1,
            },
          ],
        },
        options: {
          devicePixelRatio: (window.devicePixelRatio || 1) * CHART_PIXEL_RATIO,
          plugins: {
            legend: { position: 'bottom' },
          },
        },
      });
    },
    /**
     * update device category chart
     * @param {Array} data user regions data
     */
    async updateChart(data) {
      this.chart.data.labels = [...Object.keys(fromPairs(data))];
      this.chart.data.datasets[0].data = [...Object.values(fromPairs(data))];
      this.chart.update();
    },
  },
};
</script>

<style lang="scss" scoped>
.realtime-device-category {
  flex: 1 1 auto;
  position: relative;
}

.ctx {
  position: relative;
  height: 90%;
  padding-top: $space-sm;
  max-width: 14.5rem;
  margin: 0 auto;
}
</style>
