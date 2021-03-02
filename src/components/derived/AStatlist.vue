<template>
  <div class="a-statlist">
    <div class="a-statlist-title">{{ title }}</div>
    <div class="a-statlist-ctx">
      <ALoading :loading="loading" :nodata="nodata" />
      <AList v-if="!loading" type="dense" :data="data" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'AStatlist',

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
.a-statlist {
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
