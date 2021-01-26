<template>
  <div class="user-settings">
    <GHeader text="Users">
      <GButton @click="handleAdd"><GIconPlus /></GButton>
    </GHeader>
    <GList :data="users" control @edit="handleEdit" @delete="handleDelete"></GList>
  </div>
</template>

<script>
/* utils */
import { logInfo, logError } from '../../utils/loggers.js';

export default {
  name: 'UserSettings',
  computed: {
    users() {
      const ret = [];
      const users = this.$store.state.USER.users;
      if (users && Array.isArray(users)) {
        for (let i = 0; i < users.length; i++) {
          const user = {};
          user.id = users[i]._id;
          user.text = users[i].username;
          user.label = users[i].isAdmin ? 'admin' : 'user';
          ret.push(user);
        }
      }
      return ret;
    },
  },
  methods: {
    /**
     * fetch users data when first mounted
     */
    async fetchUsers() {
      let res, buf;
      try {
        res = await this.$axios.get('/user');
        this.$store.commit('UPDATE_ALL_USERS', { data: res.data });
        buf = 'user list initialized';
        logInfo(buf);
      } catch (e) {
        buf = 'failed to fetch user list';
        this.$error(buf);
        logError(buf, e);
      }
    },
    /**
     * [TODO]
     * handle user add
     */
    handleAdd() {
      this.$error('multi-user feature coming soon');
    },
    /**
     * handle user edit
     * @param {string} id
     */
    handleEdit(id) {
      this.$store.commit('EDIT_USER', { _id: id });
    },
    /**
     * [TODO]
     * handle user delete
     */
    handleDelete() {
      this.$error("you can't delete root user");
    },
  },
  async mounted() {
    await this.fetchUsers();
  },
};
</script>

<style lang="scss">
.user-settings {
  margin: $space-lg;
}
</style>
