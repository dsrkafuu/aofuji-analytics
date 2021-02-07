<template>
  <div class="realtime">
    <div class="row row-hero">
      <VCard class="count">
        <div class="section">
          <div class="title">Users Online</div>
          <div class="ctx ctx-uo">456</div>
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
          <VList class="ctx ctx-pv" type="dense" :data="pv" graph>123</VList>
        </div>
      </VCard>
      <VCard class="data">
        <div class="section">
          <div class="title">User Sources</div>
          <VList class="ctx ctx-us" type="dense" :data="us" graph>123</VList>
        </div>
      </VCard>
    </div>
  </div>
</template>

<script>
import { topojson } from 'chartjs-chart-geo';
import mapData from '@/assets/json/countries-110m.json';

export default {
  name: 'Realtime',
  data() {
    return {
      pv: [
        { id: 1, text: '/' },
        { id: 2, text: '/post' },
        { id: 3, text: '/post/2020/extract-sf-pingfang' },
        { id: 4, text: '/post/2020/umami-analytics' },
        { id: 5, text: '/post/2020/potplayer-with-lav-fliters' },
        { id: 6, text: '/post/2019/hugo-custom-pagination' },
        { id: 7, text: '/code' },
        { id: 8, text: '/code/2' },
        { id: 9, text: '/code/5' },
        { id: 10, text: '/post/2' },
      ],
      us: [
        { id: 11, text: '(direct)' },
        { id: 12, text: 'twelve' },
        { id: 13, text: 'tt' },
        { id: 14, text: 'ft' },
        { id: 15, text: 'ft' },
        { id: 16, text: 'st' },
      ],
    };
  },
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
