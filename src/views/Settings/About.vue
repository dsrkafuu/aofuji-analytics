<template>
  <div class="about">
    <GHeader text="About"></GHeader>
    <div class="test">
      <GButton @click="handleTest">click here to test api</GButton>
      <div class="test-api" v-if="testAPI">
        <pre>{{ testAPI }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
/* utils */
import { logInfo, logError } from '@/utils/loggers.js';

export default {
  name: 'About',
  data() {
    return {
      testAPI: null,
    };
  },
  methods: {
    async handleTest() {
      let res;
      try {
        res = await this.$axios.get('/admin/debug?cache=0');
        this.testAPI = res.data;
        this.$info('debug data fetched');
        logInfo(res.data);
      } catch (e) {
        this.$error('failed to process debug test');
        logError(e);
      }
    },
  },
};
</script>

<style lang="scss">
.about {
  margin: $space-lg;

  .test {
    span {
      margin-left: $space-sm;
      margin-right: $space-sm;
    }

    .test-api pre {
      margin: $space-base;
      font-size: $font-size-xs;
    }
  }
}
</style>
