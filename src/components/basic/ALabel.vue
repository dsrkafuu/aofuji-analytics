<template>
  <span class="a-label">
    <slot></slot>
  </span>
</template>

<script>
export default {
  name: 'ALabel',
};
</script>

<style lang="scss">
.a-label {
  background-color: var(--color-wrapper);
  padding: $space-xs 1.25 * $space-xs;
  border-radius: $radius;
  margin: 0 auto;
  text-align: center;
}
</style>
