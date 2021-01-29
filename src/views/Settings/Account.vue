<template>
  <div class="account">
    <GHeader text="Account">
      <GButton @click="handleCheck"><GIconCheck /></GButton>
    </GHeader>
    <div class="line">
      <span class="keyname">ID</span>
      <GLabel>{{ id }}</GLabel>
    </div>
    <div class="line">
      <span class="keyname">Username</span>
      <GInput class="name" v-model="username" :validator="validUsername" />
    </div>
    <div class="line">
      <span class="keyname">Password</span>
      <GInput class="pass" v-model="password" type="password" :validator="validPassword" />
    </div>
  </div>
</template>

<script>
/* utils */
import { logInfo, logError } from '@/utils/loggers.js';
import { validUsername, validPassword } from '@/utils/validators.js';

export default {
  name: 'Account',
  data() {
    return {
      validUsername,
      validPassword,
      id: '',
      username: '',
      password: '',
    };
  },
  methods: {
    /**
     * fetch account data when first mounted
     */
    async fetchAccount() {
      let res;
      try {
        res = await this.$axios.get('/admin/account');
        this.id = res.data._id;
        this.username = res.data.username;
        logInfo(res.data);
      } catch (e) {
        this.$error('failed to fetch account');
        logError(e);
      }
    },
    /**
     * modify account data
     */
    async handleCheck() {
      if (!this.username || !validUsername(this.username)) {
        this.$error('not a valid username');
        return;
      }
      if (!this.password || !validPassword(this.password)) {
        this.$error('not a valid password');
        return;
      }
      let res;
      try {
        res = await this.$axios.put(`/admin/account/${this.id}`, {
          username: this.username,
          password: this.password,
        });
        // re-login after account changed
        res = await this.$axios.post('/login', {
          username: this.username,
          password: this.password,
        });
        this.$info('account modified');
        logInfo(res.data);
      } catch (e) {
        this.$error('failed to modify account');
        logError(e);
      }
    },
  },
  async mounted() {
    await this.fetchAccount();
  },
};
</script>

<style lang="scss">
.account {
  padding: $space-lg;

  .line {
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

    .keyname {
      font-weight: 500;
      height: 2.5rem;
      line-height: 2.5rem;
      width: 10rem;
    }
  }
}
</style>
