<template>
  <router-link :to="to" v-slot="{ href, navigate, isActive }">
    <VButton
      :type="type"
      :href="href"
      @click="navigate"
      :class="['v-router-link', { 'v-router-link-active': isActive }]"
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
.v-router-link {
  &-active {
    color: var(--color-primary);
  }
}
</style>
