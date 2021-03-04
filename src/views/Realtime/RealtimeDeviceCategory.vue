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
import { Chart, theme } from '@/utils/chartjs';
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
    // theme
    theme() {
      return this.$store.state.theme.theme;
    },
  },
  watch: {
    data(data) {
      if (this.chart) {
        this.updateChart(data);
      } else {
        this.drawChart(data);
      }
    },
    // watch theme change
    theme() {
      this.updateChart();
    },
  },

  mounted() {
    if (!this.nodata) {
      this.drawChart(this.data);
    }
  },

  methods: {
    /**
     * compute display labels
     * @param {Array} data
     */
    computeLabels(data) {
      const labels = [...Object.keys(fromPairs(data))];
      labels.forEach((val, idx) => {
        labels[idx] = val.charAt(0).toUpperCase() + val.slice(1);
      });
      return labels;
    },
    /**
     * draw device category chart
     * @param {Array} data
     */
    drawChart(data) {
      this.chart = new Chart(this.$refs.deviceCategoryRef, {
        type: 'doughnut',
        data: {
          labels: this.computeLabels(data),
          datasets: [
            {
              data: [...Object.values(fromPairs(data))],
              backgroundColor: [theme.primaryColor, theme.secondaryColor, theme.baseColor],
              hoverBackgroundColor: [
                theme.primaryActiveColor,
                theme.secondaryActiveColor,
                theme.baseActiveColor,
              ],
              borderWidth: 0,
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
    updateChart(data) {
      if (this.chart) {
        if (data) {
          this.chart.data.labels = this.computeLabels(data);
          this.chart.data.datasets[0].data = [...Object.values(fromPairs(data))];
        }
        this.chart.update();
      }
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
