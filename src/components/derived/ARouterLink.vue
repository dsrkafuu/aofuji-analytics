<template>
  <router-link :to="to" v-slot="{ href, navigate, isActive }" custom>
    <AButton
      :type="type"
      :href="href"
      @click="navigate"
      :class="['a-router', { 'a-router-active': isActive }]"
    >
      <slot></slot>
    </AButton>
  </router-link>
</template>

<script>
export default {
  name: 'ARouterLink',

  props: {
    to: [String, Object],
    type: String,
  },
};
</script>

<style lang="scss">
.a-router-active {
  color: var(--color-primary);
}
</style>
