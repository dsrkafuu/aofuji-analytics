<template>
  <div class="user-settings">
    <GList :data="data" control></GList>
  </div>
</template>

<script>
/* utils */
import { logInfo, logError } from '../../utils/logger.js';
/* components */
import GList from '../../components/GList.vue';

export default {
  name: 'UserSettings',
  components: {
    GList,
  },
  data() {
    return {
      data: [],
    };
  },
  methods: {
    /**
     * fetch users data when first mounted
     */
    async fetchUsers() {
      let res;
      try {
        res = await this.$axios.get('/users');
      } catch (e) {
        this.$error(`failed to fetch users`);
        logError(`failed to fetch users`, e);
        res = null;
      }
      if (res && Array.isArray(res.data)) {
        for (let i = 0; i < res.data.length; i++) {
          const user = res.data[i];
          user.id = user._id;
          user.text = user.username;
          user.label = user.isAdmin ? 'admin' : 'user';
        }
        this.data = res.data;
      }
    },
  },
  async mounted() {
    await this.fetchUsers();
    logInfo('users data initialized');
  },
};
</script>

<style lang="scss">
.user-settings {
  margin: $space-base;
}
</style>
