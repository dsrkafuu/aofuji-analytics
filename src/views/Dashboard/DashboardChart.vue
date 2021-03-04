<template>
  <div class="dashboard-chart">
    <ALoading :loading="loading" :nodata="nodata" />
    <div class="ctx">
      <canvas ref="chartRef"></canvas>
    </div>
  </div>
</template>

<script>
import { CHART_PIXEL_RATIO } from '@/utils/constants';
import { Chart, theme } from '@/utils/chartjs';

export default {
  name: 'DashboardChart',

  props: {
    pvsData: { type: Array },
    ussData: { type: Array },
    loading: { type: Boolean },
  },
  data() {
    return {
      chart: null,
    };
  },
  computed: {
    data() {
      return [this.pvsData, this.ussData];
    },
    nodata() {
      return this.pvsData.reduce((preVal, curVal) => preVal + curVal, 0) <= 0;
    },
    // theme
    theme() {
      return this.$store.state.theme.theme;
    },
  },
  watch: {
    data(data) {
      if (this.chart) {
        this.updateChart(data[0], data[1]);
      } else {
        this.drawChart(data[0], data[1]);
      }
    },
    // watch theme change
    theme() {
      this.updateChart();
    },
  },

  mounted() {
    if (!this.nodata) {
      this.drawChart(this.data[0], this.data[1]);
    }
  },

  methods: {
    /**
     * draw device category chart
     * @param {Array} pvsData page views steps
     * @param {Array} ussData unique sessions steps
     */
    drawChart(pvsData, ussData) {
      this.chart = new Chart(this.$refs.chartRef, {
        type: 'bar',
        data: {
          labels: pvsData.map((val, index) => `${index}`),
          datasets: [
            {
              label: 'Unique Sessions',
              data: ussData,
              backgroundColor: theme.primaryColor,
              hoverBackgroundColor: theme.primaryActiveColor,
            },
            {
              label: 'Page Views',
              data: pvsData,
              backgroundColor: theme.baseColor,
              hoverBackgroundColor: theme.baseActiveColor,
            },
          ],
        },
        options: {
          devicePixelRatio: (window.devicePixelRatio || 1) * CHART_PIXEL_RATIO,
          maintainAspectRatio: false,
          scales: {
            x: { gridLines: { display: false, color: theme.nullColor }, stacked: true },
            y: { gridLines: { color: theme.nullColor } },
          },
          plugins: {
            legend: { position: 'bottom' },
          },
        },
      });
    },
    /**
     * update device category chart
     * @param {Array} pvsData page views steps
     * @param {Array} ussData unique sessions steps
     */
    updateChart(pvsData, ussData) {
      if (this.chart) {
        if (pvsData && ussData) {
          this.chart.data.labels = pvsData.map((val, index) => `${index}`);
          this.chart.data.datasets[0].data = ussData;
          this.chart.data.datasets[1].data = pvsData;
          this.chart.update();
        } else {
          // this.chart.update();
          // fix axis color not updated issue
          this.chart.destroy();
          this.drawChart(this.data[0], this.data[1]);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard-chart,
.ctx {
  position: relative;
  height: 100%;
}
</style>
