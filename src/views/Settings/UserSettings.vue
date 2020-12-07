<template>
  <div class="user-settings">
    <GList :data="data" control></GList>
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
          text: 'amzrk2.cc',
          label: 's1',
        },
        {
          id: '2',
          text: 'dsrca.amzrk2.cc',
          label: 'ss2',
        },
        {
          id: '3',
          text: 'github.com/pouni-calculation-tester',
          label: 'sss3',
        },
      ],
    };
  },
};
</script>

<style lang="scss" src="./UserSettings.scss">
</style>