<template>
  <div class="user-edit">
    <GHeader :text="`${id ? 'editing' : 'adding'} user`">
      <GButton @click="handleExit"><GIconTimes /></GButton>
      <GButton @click="handleCheck"><GIconCheck /></GButton>
    </GHeader>
    <div class="user-edit-line" v-show="id">
      <span>id</span>
      <GLabel>{{ id }}</GLabel>
    </div>
    <div class="user-edit-line">
      <span>username</span>
      <GInput class="user-name" v-model="username" disabled />
    </div>
    <div class="user-edit-line">
      <span>password</span>
      <GInput class="user-pass" v-model="password" />
    </div>
  </div>
</template>

<script>
/* utils */
import { logInfo, logError } from '../../utils/logger.js';

export default {
  name: 'UserEdit',
  data() {
    return {
      username: '',
      password: '',
      isAdmin: true,
    };
  },
  computed: {
    id() {
      return this.$store.state.SETTINGS.editing.id;
    },
  },
  methods: {
    /**
     * fetch user data with id when activated
     */
    fetchUser() {
      this.username = 'admin';
    },
    /**
     * add a new user or modify website data
     */
    async handleCheck() {
      if (!this.id) {
        return;
      }
      let res, buf;
      try {
        res = await this.$axios.put(`/user/${this.id}`, {
          username: this.username,
          password: this.password,
          isAdmin: this.isAdmin,
        });
        buf = 'user modified';
        this.$info(buf);
        logInfo(buf, res.data);
        this.$store.dispatch('EDIT_SETTING'); // exit editing
      } catch (e) {
        buf = 'failed to modify user';
        this.$error(buf);
        logError(buf, e);
      }
    },
    /**
     * exit editing
     */
    handleExit() {
      this.$store.dispatch('EDIT_SETTING');
    },
  },
  async activated() {
    // if editing instead of creating
    if (this.id) {
      await this.fetchUser();
      logInfo(`user ${this.id} initialized`);
    }
  },
  deactivated() {
    this.username = '';
    this.password = '';
  },
};
</script>

<style lang="scss">
.user-edit {
  padding: $space-lg;

  .user-edit-line {
    display: flex;
    align-items: center;
    padding: 0 $space-sm;

    .g-label,
    .g-input {
      margin: 0 !important;
      min-width: 20rem;
      text-align: left;
    }

    .g-label {
      font-size: $font-size-sm;
      height: 2rem;
      line-height: 2rem;
      padding: 0 $space-xs * 1.75;
    }

    span:first-child {
      font-weight: 500;
      height: 2.5rem;
      line-height: 2.5rem;
      width: 10rem;
    }
  }
}
</style>
