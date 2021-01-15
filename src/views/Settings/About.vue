<template>
  <div class="about">
    <button @click="Date.now() % 2 === 0 ? $info(Date.now()) : $error(Date.now())">test 1</button>
  </div>
</template>

<script>
export default {
  name: 'About',
};
</script>

<style>
</style>
