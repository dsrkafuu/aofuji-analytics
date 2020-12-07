<template>
  <div class="g-card">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'GCard',
};
</script>

<style lang="scss">
.g-card {
  background-color: var(--color-bg);
  box-shadow: var(--shadow);
  border-radius: $radius;
  overflow: hidden; // prevent internal elements to cover radius
}
</style>