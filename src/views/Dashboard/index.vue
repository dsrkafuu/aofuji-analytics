<template>
  <div class="dashboard">dashboard</div>
</template>

<script>
export default {
  name: 'Dashboard',
  activated() {
    // ensure search param exist
    const website = this.$store.state.COMMON.selectedWebsite?._id;
    if (website && !this.$route.query.website) {
      this.$router.replace({
        query: { website },
      });
    }
  },
};
</script>
