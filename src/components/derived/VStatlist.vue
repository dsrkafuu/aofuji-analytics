<template>
  <div class="v-statlist">
    <div class="v-statlist-title">{{ title }}</div>
    <div class="v-statlist-ctx">
      <VLoading :loading="loading" :nodata="nodata" />
      <VList v-if="!loading" type="dense" :data="data" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'VStatlist',

  props: {
    title: { type: String },
    data: { type: Array },
    loading: { type: Boolean },
  },
  computed: {
    nodata() {
      return this.data.length <= 0;
    },
  },
};
</script>

<style lang="scss">
.v-statlist {
  display: flex;
  flex-direction: column;

  &-title {
    padding: $space-lg;
    padding-bottom: 0;
  }

  &-ctx {
    flex: 1 1 auto;
    padding: $space-sm;
    padding-bottom: $space-base;
    position: relative;
  }
}
</style>
