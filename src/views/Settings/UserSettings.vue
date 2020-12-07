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
          text: 'admin',
          label: 's1',
        },
        {
          id: '2',
          text: 'amzrk2',
          label: 'ss2',
        },
      ],
    };
  },
};
</script>

<style lang="scss">
.user-settings {
  margin: $space-base;
}
</style>