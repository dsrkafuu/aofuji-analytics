<template>
  <div class="settings">
    <GCard class="settings-ctrl">
      <GButton type="full-width" active>Websites</GButton>
      <GButton type="full-width" href="https://example.org" target="_blank">Websites</GButton>
    </GCard>
    <GCard class="settings-content">
      <GButton active href="https://example.org" target="_blank">Websites</GButton>
      <GButton disabled>Websites</GButton>
    </GCard>
  </div>
</template>

<script>
import GButton from '../../components/GButton.vue';
import GCard from '../../components/GCard.vue';

export default {
  name: 'Settings',
  components: {
    GButton,
    GCard,
  },
};
</script>

<style lang="scss" src="./Settings.scss">
</style>