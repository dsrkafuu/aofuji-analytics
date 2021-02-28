<template>
  <div class="section">
    <div class="ctx ctx-chart">
      <canvas ref="chartRef"></canvas>
    </div>
  </div>
</template>

<script>
import { CHART_PIXEL_RATIO } from '@/utils/constants';
import { Chart } from '@/utils/chartjs';

export default {
  name: 'DashboardChart',
  props: {
    pvsData: { type: Array },
    ussData: { type: Array },
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
  },
  watch: {
    data(data) {
      if (this.chart) {
        this.updateChart(data[0], data[1]);
      } else {
        this.drawChart(data[0], data[1]);
      }
    },
  },
  methods: {
    /**
     * draw device category chart
     * @param {Array} pvsData page views steps
     * @param {Array} ussData unique sessions steps
     */
    async drawChart(pvsData, ussData) {
      this.chart = new Chart(this.$refs.chartRef, {
        type: 'bar',
        data: {
          labels: pvsData.map((val, index) => `${index}`),
          datasets: [
            { label: 'Unique Sessions', data: ussData, backgroundColor: '#aba4d3' },
            { label: 'Page Views', data: pvsData, backgroundColor: '#9db1da' },
          ],
        },
        options: {
          devicePixelRatio: (window.devicePixelRatio || 1) * CHART_PIXEL_RATIO,
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
     * update device category chart
     * @param {Array} pvsData page views steps
     * @param {Array} ussData unique sessions steps
     */
    async updateChart(pvsData, ussData) {
      this.chart.data.labels = pvsData.map((val, index) => `${index}`);
      this.chart.data.datasets[0].data = ussData;
      this.chart.data.datasets[1].data = pvsData;
      this.chart.update();
    },
  },
};
</script>

<style lang="scss" scoped>
.section,
.ctx-chart {
  height: 100%;
}
</style>