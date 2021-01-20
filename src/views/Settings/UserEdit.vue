<template>
  <div class="edit">UserEdit id: {{ id }}</div>
</template>

<script>
export default {
  name: 'UserEdit',
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
