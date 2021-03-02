<template>
  <div class="a-container">
    <ACard class="not-found">
      <span>OOPS</span>
      <span>404 PAGE NOT FOUND</span>
      <ARouterLink :to="{ name: 'Dashboard' }">Back to dashboard</ARouterLink>
    </ACard>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
};
</script>

<style lang="scss" scoped>
.not-found {
  margin: $space-lg;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  span {
    margin-top: $space-lg;
    font-size: $font-size-xl;
    font-weight: 500;
  }
  a {
    margin: $space-base 0;
  }
}
</style>
