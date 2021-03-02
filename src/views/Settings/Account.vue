<template>
  <div class="account">
    <AHeader text="Account">
      <AButton @click="handleCheck" :loading="awaitingCheck">
        <AIconCheck />
      </AButton>
    </AHeader>
    <div class="content">
      <div class="line">
        <span class="keyname">ID</span>
        <ALabel>{{ id }}</ALabel>
      </div>
      <div class="line">
        <span class="keyname">Username</span>
        <AInput class="name" v-model="username" :validator="validUsername" />
      </div>
      <div class="line">
        <span class="keyname">Password</span>
        <AInput class="pass" v-model="password" type="password" :validator="validPassword" />
      </div>
    </div>
  </div>
</template>

<script>
import { validUsername, validPassword } from '@/utils/validators';

export default {
  name: 'Account',

  data() {
    return {
      id: '',
      username: '',
      password: '',

      awaitingCheck: false,
    };
  },
  computed: {
    account() {
      return this.$store.state.common.account;
    },
  },

  mounted() {
    this.fetchAccount();
  },

  methods: {
    validUsername,
    validPassword,
    /**
     * fetch account data when first mounted
     */
    fetchAccount() {
      this.id = this.account._id;
      this.username = this.account.username;
    },
    /**
     * modify account data
     */
    async handleCheck() {
      this.awaitingCheck = true;
      if (!this.username || !validUsername(this.username)) {
        this.$error('not a valid username');
        this.awaitingCheck = false;
        return;
      }
      if (!this.password || !validPassword(this.password)) {
        this.$error('not a valid password');
        this.awaitingCheck = false;
        return;
      }
      await this.$store.dispatch('settings/xaPutAccount', {
        _id: this.id,
        username: this.username,
        password: this.password,
      });
      this.awaitingCheck = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.account {
  padding: $space-lg;
}
.content {
  position: relative;
  min-height: 3rem;
}

.line {
  display: flex;
  align-items: center;
  padding: 0 $space-sm;
  .a-label,
  .a-input {
    margin: 0 !important;
    min-width: 20rem;
    text-align: left;
  }
  .a-label {
    font-size: $font-size-sm;
    height: 2rem;
    line-height: 2rem;
    padding: 0 $space-xs * 1.75;
  }
}

.keyname {
  font-weight: 500;
  height: 2.5rem;
  line-height: 2.5rem;
  width: 10rem;
}
</style>
