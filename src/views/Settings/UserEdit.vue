<template>
  <div class="user-edit">
    <GHeader :text="`${_id ? 'editing' : 'adding'} user`">
      <GButton @click="handleExit"><GIconTimes /></GButton>
      <GButton @click="handleCheck"><GIconCheck /></GButton>
    </GHeader>
    <div class="user-edit-line" v-show="_id">
      <span>id</span>
      <GLabel>{{ _id }}</GLabel>
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
import { logInfo, logError } from '@/utils/loggers.js';

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
    _id() {
      return this.$store.state.USER.editing._id;
    },
  },
  methods: {
    /**
     * init user data with id when activated
     */
    initUser() {
      this.username = 'admin';
    },
    /**
     * add a new user or modify website data
     */
    async handleCheck() {
      if (!this._id) {
        return;
      }
      let res, buf;
      try {
        res = await this.$axios.put(`/user/${this._id}`, {
          username: this.username,
          password: this.password,
          isAdmin: this.isAdmin,
        });
        this.$store.commit('UPDATE_USER', { _id: this._id, data: res.data });
        buf = 'user modified';
        this.$info(buf);
        logInfo(buf, res.data._id);
        this.handleExit();
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
      this.$store.commit('EXIT_EDIT_USER');
    },
  },
  async activated() {
    // if editing instead of creating
    if (this._id) {
      this.initUser();
    }
  },
  deactivated() {
    this.username = '';
    this.password = '';
    this.isAdmin = true;
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
