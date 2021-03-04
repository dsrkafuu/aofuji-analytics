<template>
  <div class="dashboard">
    <div class="row row-hero">
      <ACard class="summary">
        <div class="range">
          <ASelect :map="rangeMap" v-model="range" />
        </div>
        <AStatistic title="Page Views" :value="pageViews" :loading="!inited" />
        <AStatistic title="Unique Visitors" :value="uniqueSessions" :loading="!inited" />
        <AStatistic title="Avg. View Time" :value="pageViewTime" type="time" :loading="!inited" />
      </ACard>
      <ACard class="chart">
        <DashboardChart
          :pvsData="pageViewSteps"
          :ussData="uniqueSessionSteps"
          :rangeMap="rangeMap"
          :range="range"
          :loading="!inited"
        />
      </ACard>
    </div>
    <div class="row row-prim">
      <ACard class="data">
        <AStatlist title="Pages" :data="pathnames" :loading="!inited" />
      </ACard>
      <ACard class="data">
        <AStatlist title="Referers" :data="referrers" :loading="!inited" />
      </ACard>
    </div>
    <div class="row row-norm">
      <ACard class="data">
        <AStatlist title="Systems" :data="systems" :loading="!inited" />
      </ACard>
      <ACard class="data">
        <AStatlist title="Browsers" :data="browsers" :loading="!inited" />
      </ACard>
      <ACard class="data">
        <AStatlist title="Device Platforms" :data="platforms" :loading="!inited" />
      </ACard>
    </div>
    <div class="row row-norm">
      <ACard class="data">
        <AStatlist title="Languages" :data="languages" :loading="!inited" />
      </ACard>
      <ACard class="data">
        <AStatlist title="Locations" :data="locations" :loading="!inited" />
      </ACard>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import DashboardChart from './DashboardChart.vue';

const rangeMap = {
  LAST_15M: { text: 'Last 15 Minutes', value: 900, step: 60 },
  LAST_24H: { text: 'Last 24 Hours', value: 86400, step: 3600 },
  LAST_7D: { text: 'Last Week', value: 604800, step: 86400 },
  LAST_30D: { text: 'Last Month', value: 2592000, step: 86400 },
};

import locales from '@/assets/json/locales/en.json';
import countries from '@/assets/json/countries/en.json';

export default {
  name: 'Dashboard',
  components: {
    DashboardChart,
  },

  data() {
    return {
      rangeMap,
      range: 'LAST_24H',
    };
  },
  computed: {
    curWebsite() {
      return this.$store.state.common.curWebsite?._id;
    },
    platforms() {
      const plats = this.$store.state.dashboard.platforms;
      plats.forEach((val, idx) => {
        const plat = val[0];
        plats[idx][0] = plat.charAt(0).toUpperCase() + plat.slice(1);
      });
      return plats;
    },
    languages() {
      const langs = this.$store.state.dashboard.languages;
      langs.forEach((val, idx) => {
        const code = val[0].replace(/-/g, '_');
        if (locales[code]) {
          langs[idx][0] = locales[code];
        }
      });
      return langs;
    },
    locations() {
      const locs = this.$store.state.dashboard.locations;
      locs.forEach((val, idx) => {
        const code = val[0];
        if (countries[code]) {
          locs[idx][0] = countries[code];
        }
      });
      return locs;
    },
    ...mapState('dashboard', [
      'inited',
      'pageViews',
      'uniqueSessions',
      'pageViewTime',
      'pageViewSteps',
      'uniqueSessionSteps',
      'pathnames',
      'referrers',
      'browsers',
      'systems',
    ]),

    // share mode computes
    shareID() {
      return this.$store.state.common.shareID || '';
    },
    shareWebsite() {
      return this.$store.state.common.curWebsite?.name || '';
    },
  },
  watch: {
    async curWebsite(_id) {
      // if not share mode, fix missing route query
      if (!this.shareID && this.$route.query.website !== _id) {
        this.$router.replace({ query: { website: _id } });
      }
      await this.fetchDashboard(
        _id,
        rangeMap[this.range].value * 1000,
        rangeMap[this.range].step * 1000
      );
    },
    async range(key) {
      if (this.inited && this.curWebsite) {
        this.$store.commit('dashboard/xmSetInited', { value: false });
        await this.fetchDashboard(
          this.curWebsite,
          rangeMap[key].value * 1000,
          rangeMap[key].step * 1000
        );
      }
    },
  },

  async mounted() {
    if (!this.inited && this.curWebsite) {
      await this.fetchDashboard(
        this.curWebsite,
        rangeMap[this.range].value * 1000,
        rangeMap[this.range].step * 1000
      );
    }
  },

  methods: {
    /**
     * fetch dashboard data
     * @param {string} _id
     * @param {number} range
     * @param {number} step
     */
    async fetchDashboard(_id, range, step) {
      if (this.shareID) {
        await this.$store.dispatch('dashboard/xaFetchShareAll', {
          _id,
          range,
          step,
          share: this.shareID,
        });
      } else {
        await this.$store.dispatch('dashboard/xaFetchAll', { _id, range, step });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  margin: $space-base;
  display: flex;
  flex-direction: column;
  gap: $space-base;
}

.row {
  display: flex;
  gap: $space-base;
  height: $dashboard-data-height;

  &-prim {
    .data:first-child {
      flex: 1 1 60%;
    }

    .data:last-child {
      flex: 1 1 40%;
    }
  }
}

.range {
  margin-top: $space-xs !important;
  margin-bottom: $space-sm;

  .a-select {
    width: 100%;
  }
}

.data {
  flex: 0 1 32.3%;

  .a-statlist {
    height: $dashboard-data-height;
  }
}

.summary {
  padding: $space-lg;
  flex: 0 0 26%;
  display: flex;
  flex-direction: column;
  gap: $space-base;
}

.chart {
  flex: 1 1 auto;
  padding: $space-base;
}
</style>
