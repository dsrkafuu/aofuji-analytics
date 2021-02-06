<template>
  <div class="realtime">
    <div class="row">
      <VCard class="count">
        <div class="section">
          <div class="title">Users in Last 15 Minutes</div>
          <div class="ctx ctx-uilm">456</div>
        </div>
        <div class="section">
          <div class="title">Device Category in Last 15 Minutes</div>
          <div class="ctx ctx-dcilm">
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
    <div class="row"></div>
  </div>
</template>

<script>
import { topojson } from 'chartjs-chart-geo';
import mapData from '@/assets/json/countries-110m.json';

export default {
  name: 'Realtime',
  mounted() {
    new this.$Chart(this.$refs.dcilm, {
      type: 'doughnut',
      data: {
        labels: ['desktop', 'tablet', 'mobile'],
        datasets: [
          {
            data: new Array(3).fill(1).map(() => Math.random()),
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

    const countries = topojson.feature(mapData, mapData.objects.countries).features;
    new this.$Chart(this.$refs.map, {
      type: 'choropleth',
      data: {
        labels: countries.map((d) => d.properties.name),
        datasets: [
          {
            data: countries.map((d) => ({ feature: d, value: Math.random() })),
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
            interpolate: (val) => `rgba(138, 162, 211, ${val})`, // color calculator
          },
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

  .row {
    display: flex;
    gap: $space-base;

    &:first-child {
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

  .count {
    padding: $space-lg;
    flex: 0 0 33%;
    display: flex;
    flex-direction: column;
    gap: $space-lg;
  }

  .ctx-uilm {
    font-size: $font-size-xl * 1.5;
    text-align: center;
  }

  .ctx-dcilm {
    padding-top: $space-sm;
    max-width: 14.5rem;
    margin: 0 auto;
  }

  .map {
    flex: 1 1 66%;
  }

  .ctx-map {
    position: relative;
    top: -3.25rem;
  }
}
</style>
