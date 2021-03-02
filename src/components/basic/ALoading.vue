<template>
  <div class="a-loading" v-if="loading || nodata">
    <template v-if="loading">
      <AIconCircle :class="{ 'a-spin': loading }" />
      <span>Loading</span>
    </template>
    <template v-else>
      <AIconExclamation />
      <span>No Data</span>
    </template>
  </div>
</template>

<script>
export default {
  name: 'ALoading',

  props: {
    loading: { type: Boolean },
    nodata: { type: Boolean },
  },
};
</script>

<style lang="scss">
.a-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: $space-xs;
  font-size: $font-size-sm;
  z-index: 20;
  background-color: var(--color-bg);
}
</style>
