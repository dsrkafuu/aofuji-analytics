<template>
  <div class="g-header">
    <span class="g-header-title">
      {{ text }}
    </span>
    <div class="g-header-ctrl">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GHeader',
  props: {
    text: String,
  },
};
</script>

<style lang="scss">
.g-header {
  height: 3rem;
  display: flex;
  user-select: none;
}

.g-header-title {
  flex: 1 1 auto;
  display: block;
  height: 3rem;
  line-height: 2rem;
  font-size: $font-size-lg;
  font-weight: 500;
}
</style>
