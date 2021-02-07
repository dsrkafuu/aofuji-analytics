<template>
  <div class="dashboard">dashboard</div>
</template>

<script>
import { Chart } from '@/utils/Chart.js';

export default {
  name: 'Dashboard',
  mounted() {
    console.log(Chart);
  },
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
