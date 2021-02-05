<template>
  <div class="v-header">
    <span class="v-header-title">
      {{ text }}
    </span>
    <div class="v-header-ctrl">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VHeader',
  props: {
    text: String,
  },
};
</script>

<style lang="scss">
.v-header {
  height: 3rem;
  display: flex;
  user-select: none;
  padding: 0 $space-sm;

  &-title {
    flex: 1 1 auto;
    display: block;
    height: 3rem;
    line-height: 2rem;
    font-size: $font-size-lg;
    font-weight: 500;
  }
}
</style>
