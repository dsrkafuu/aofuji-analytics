<template>
  <div class="user-settings">
    <GList :data="data" control :type="'extend'"></GList>
  </div>
</template>

<script>
import GList from '../../components/GList.vue';

export default {
  name: 'UserSettings',
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
          label: 's1',
        },
        {
          id: '2',
          text: 'DSRCA',
          sub: 'dsrca.amzrk2.cc',
          label: 'ss2',
        },
        {
          id: '3',
          text: 'Pouni Calculation Tester',
          sub: 'github.com/pouni-calculation-tester',
          label: 'sss3',
        },
      ],
    };
  },
};
</script>

<style lang="scss" src="./UserSettings.scss">
</style>