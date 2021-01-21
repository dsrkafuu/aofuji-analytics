<template>
  <span class="g-label">
    <slot></slot>
  </span>
</template>

<script>
/**
 * [vue 3]
 * compatible
 */

export default {
  name: 'GLabel',
};
</script>

<style lang="scss">
.g-label {
  background-color: var(--color-wrapper);
  padding: $space-xs 1.25 * $space-xs;
  border-radius: $radius;
  margin: 0 auto;
  text-align: center;
}
</style>
