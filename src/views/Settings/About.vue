<template>
  <div class="about">
    <VHeader text="About"></VHeader>
    <div class="test">
      <VButton @click="handleTest">Click Here to Test API</VButton>
      <div class="test-api" v-if="testData">
        <pre>{{ testData }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
import { cloneDeep } from '@/utils/lodash';

export default {
  name: 'About',

  data() {
    return {
      testData: null,
    };
  },

  methods: {
    async handleTest() {
      const res = await this.$api.get('/admin/debug?cache=0');
      this.testData = cloneDeep(res.data);
      this.$info('debug data fetched');
    },
  },
};
</script>

<style lang="scss" scoped>
.about {
  padding: $space-lg;
}

.test span {
  margin-left: $space-sm;
  margin-right: $space-sm;
}

.test-api pre {
  margin: $space-base;
  font-size: $font-size-xs;
}
</style>
