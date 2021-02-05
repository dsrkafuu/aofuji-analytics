<template>
  <div class="realtime">
    <div class="row">
      <VCard class="count">
        <div class="section">
          <div class="title">Users in Last 15 Minutes</div>
          <div class="data data-uilm">456</div>
        </div>
        <div class="section">
          <div class="title">Device Category in Last 15 Minutes</div>
          <div class="data data-dcilm">
            <canvas ref="dcilm"></canvas>
          </div>
        </div>
      </VCard>
      <VCard class="map">2</VCard>
    </div>
    <div class="row"></div>
  </div>
</template>

<script>
import Chart from 'chart.js';

export default {
  name: 'Realtime',
  mounted() {
    const upmNode = this.$refs.dcilm;
    const upmCtx = upmNode.getContext('2d');
    Chart.defaults.global.defaultFontColor = 'var(--color-font)';
    Chart.defaults.global.defaultFontFamily = 'inherit';
    new Chart(upmCtx, {
      type: 'doughnut',
      data: {
        labels: ['desktop', 'tablet', 'mobile'],
        datasets: [
          {
            data: [244, 26, 191],
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
            borderWidth: 0,
          },
        ],
      },
      options: {
        legend: {
          position: 'bottom',
        },
      },
    });
  },
};
</script>

<style lang="scss">
.realtime {
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

    .data {
      margin-top: $space-sm;
    }
  }

  .row {
    display: flex;
    gap: $space-base;
  }

  .count {
    padding: $space-lg;
    flex: 0 0 33%;
    display: flex;
    flex-direction: column;
    gap: $space-lg;
  }

  .map {
    flex: 1 1 66%;
  }

  .data-uilm {
    font-size: $font-size-xl * 1.5;
    text-align: center;
  }

  .data-dcilm {
    padding-top: $space-sm;
  }
}
</style>
