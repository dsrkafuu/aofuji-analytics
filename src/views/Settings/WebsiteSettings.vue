<template>
  <div class="website-settings">
    <GList :data="data" control :type="'extend'"></GList>
  </div>
</template>

<script>
import GList from '../../components/GList.vue';

export default {
  name: 'WebsiteSettings',
  components: {
    GList,
  },
  data() {
    return {
      data: [
        {
          id: '1',
          text: 'DSRKafuU Main Home',
          sub: 'amzrk2.cc',
          label: 'public',
        },
        {
          id: '2',
          text: 'DSRCA',
          sub: 'dsrca.amzrk2.cc',
          label: 'private',
        },
        {
          id: '3',
          text: 'Pouni Calculation Tester',
          sub: 'github.com/pouni-calculation-tester',
          label: 'private',
        },
      ],
    };
  },
};
</script>

<style lang="scss">
.website-settings {
  margin: $space-base;
}
</style>
