<template>
  <div class="about">
    <div class="test">
      <span>tests</span>
      <GButton @click="handleTestInfo">$info()</GButton>
      <GButton @click="handleTestError">$error()</GButton>
      <GButton @click="handleTestAPI">/api/debug</GButton>
      <div class="test-api-debug" v-if="testAPIDebug">
        <pre>{{ testAPIDebug }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
/* components */
import GButton from '../../components/GButton.vue';

export default {
  name: 'About',
  components: {
    GButton,
  },
  data() {
    return {
      testAPIDebug: '',
    };
  },
  methods: {
    handleTestInfo() {
      this.$info(Date.now());
    },
    handleTestError() {
      this.$error(Date.now());
    },
    async handleTestAPI() {
      const res = await this.$axios.get('/debug');
      this.testAPIDebug = res.data;
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
