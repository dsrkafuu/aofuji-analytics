<template>
  <div class="v-nodata">
    <VIconExclamation />
    <span>No Data</span>
  </div>
</template>

<script>
export default {
  name: 'VNoData',
};
</script>

<style lang="scss">
.v-nodata {
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
