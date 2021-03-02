<template>
  <div class="v-card">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'VCard',
};
</script>

<style lang="scss">
.v-card {
  background-color: var(--color-bg);
  box-shadow: var(--shadow);
  border-radius: $radius;
}
</style>
