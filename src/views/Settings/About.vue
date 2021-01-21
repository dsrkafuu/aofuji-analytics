<template>
  <div class="about">
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
import { logInfo, logError } from '../../utils/logger.js';

export default {
  name: 'About',
  data() {
    return {
      testAPI: null,
    };
  },
  methods: {
    async handleTest() {
      let res, buf;
      try {
        res = await this.$axios.get('/debug');
        this.testAPI = res.data;
        buf = 'debug test data got';
        this.$info(buf);
        logInfo(buf, res.data);
      } catch (e) {
        buf = 'failed to proceed debug test';
        this.$error('failed to proceed debug test');
        logError(buf, e);
      }
    },
  },
};
</script>

<style lang="scss">
.about {
  margin: $space-base;

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
