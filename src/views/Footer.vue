<template>
  <footer class="footer">
    <div class="a-container">
      <div class="power">Powered by Aofuji Analytics</div>
      <div class="copy">&copy; 2020-{{ new Date().getFullYear() }} DSRKafuU</div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
};
</script>

<style lang="scss" scoped>
.footer {
  background-color: var(--color-bg);
  height: $navbar-height * 1.5;
  box-shadow: var(--shadow);
  font-size: $font-size-sm;
  line-height: 1.5rem;

  .a-container {
    height: $navbar-height * 1.5;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}
</style>
