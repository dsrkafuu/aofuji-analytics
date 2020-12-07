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
          label: 'admin',
        },
        {
          id: '2',
          text: 'amzrk2',
          label: 'user',
        },
        {
          id: '3',
          text: 'goose',
          label: 'user',
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