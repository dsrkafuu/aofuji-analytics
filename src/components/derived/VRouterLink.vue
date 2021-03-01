<template>
  <router-link :to="to" v-slot="{ href, navigate, isActive }" custom>
    <VButton
      :type="type"
      :href="href"
      @click="navigate"
      :class="['v-router', { 'v-router-active': isActive }]"
    >
      <slot></slot>
    </VButton>
  </router-link>
</template>

<script>
export default {
  name: 'VRouterLink',

  props: {
    to: [String, Object],
    type: String,
  },
};
</script>

<style lang="scss">
.v-router-active {
  color: var(--color-primary);
}
</style>
