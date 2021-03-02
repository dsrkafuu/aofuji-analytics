<template>
  <div class="a-statistic">
    <div class="a-statistic-title">{{ title }}</div>
    <div class="a-statistic-value">
      <ALoading :loading="loading" />
      <span class="a-statistic-ctx" v-if="!loading">{{ fmtValue }}</span>
    </div>
  </div>
</template>

<script>
import { fmtNumber, fmtTime } from '@/utils/formatters';

export default {
  name: 'AStatistic',

  props: {
    type: {
      type: String,
      validator: (val) => {
        return ['number', 'time'].includes(val);
      },
      default: 'number',
    },
    title: { type: String },
    value: { type: Number },
    loading: { type: Boolean },
  },
  computed: {
    fmtValue() {
      if (this.type === 'time') {
        return fmtTime(this.value);
      } else {
        return fmtNumber(this.value);
      }
    },
  },
};
</script>

<style lang="scss">
.a-statistic {
  &-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &-value {
    margin-top: $space-sm;
    height: $font-size-xl * 1.5 * 1.15;
    text-align: center;
    position: relative;
  }

  &-ctx {
    display: block;
    font-size: $font-size-xl * 1.5;
    line-height: $font-size-xl * 1.5 * 1.15;
    text-align: center;
    position: relative;
  }
}
</style>
