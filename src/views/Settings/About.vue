<template>
  <div class="about">
    <div class="test">
      <span>tests</span>
      <GButton @click="handleTestAPI">/api/debug</GButton>
      <GButton @click="handleTestAPIError">/api/error</GButton>
      <div class="test-api-debug" v-if="testAPIDebug">
        <pre>{{ testAPIDebug }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'About',
  data() {
    return {
      testAPIDebug: '',
    };
  },
  methods: {
    async handleTestAPI() {
      const res = await this.$axios.get('/debug');
      if (res) {
        this.testAPIDebug = res.data;
        this.$info('successfully get `/api/debug`');
      }
    },
    async handleTestAPIError() {
      const res = await this.$axios.get('/error');
      if (res) {
        this.testAPIDebug = res.data;
        this.$info('successfully get `/api/error`');
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

    .test-api-debug pre {
      margin: $space-base;
      font-size: $font-size-xs;
    }
  }
}
</style>
