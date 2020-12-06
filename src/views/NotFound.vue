<template>
  <div class="container">
    <GCard class="not-found">
      <span>OOPS</span>
      <span>404 PAGE NOT FOUND</span>
      <GRouterLink :to="{ name: 'Dashboard' }">Back to dashboard</GRouterLink>
    </GCard>
  </div>
</template>

<script>
import GCard from '../components/GCard.vue';
import GRouterLink from '../components/GRouterLink.vue';

export default {
  name: 'NotFound',
  components: {
    GCard,
    GRouterLink,
  },
};
</script>

<style lang="scss" src="./NotFound.scss">
</style>