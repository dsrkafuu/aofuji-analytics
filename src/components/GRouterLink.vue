<template>
  <router-link :to="to" v-slot="{ href, navigate, isActive }">
    <GButton
      :type="type"
      :href="href"
      @click="navigate"
      :class="['g-router-link', { 'g-router-active': isActive }]"
    >
      <slot></slot>
    </GButton>
  </router-link>
</template>

<script>
import GButton from './GButton.vue';

export default {
  name: 'GRouterLink',
  components: {
    GButton,
  },
  props: {
    to: [String, Object],
    type: String,
  },
};
</script>

<style lang="scss">
.g-router-link {
  &.g-router-active {
    color: var(--color-primary);
  }
}
</style>