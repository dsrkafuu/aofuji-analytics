<template>
  <div class="a-card">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'ACard',
};
</script>

<style lang="scss">
.a-card {
  background-color: var(--color-bg);
  box-shadow: var(--shadow);
  border-radius: $radius;
}
</style>
