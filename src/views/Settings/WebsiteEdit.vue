<template>
  <div class="edit">WebsiteEdit id: {{ id }}</div>
</template>

<script>
export default {
  name: 'WebsiteEdit',
  computed: {
    id() {
      return this.$store.state.editing.id;
    },
  },
};
</script>

<style lang="scss">
.edit {
}
</style>
