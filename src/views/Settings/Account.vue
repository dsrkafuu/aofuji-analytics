<template>
  <div class="account">
    <VHeader text="Account">
      <VButton @click="handleCheck">
        <VIconCheck />
      </VButton>
    </VHeader>
    <div class="line">
      <span class="keyname">ID</span>
      <VLabel>{{ id }}</VLabel>
    </div>
    <div class="line">
      <span class="keyname">Username</span>
      <VInput class="name" v-model="username" :validator="validUsername" />
    </div>
    <div class="line">
      <span class="keyname">Password</span>
      <VInput class="pass" v-model="password" type="password" :validator="validPassword" />
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
      if (!this.username || !validUsername(this.username)) {
        this.$error('not a valid username');
        return;
      }
      if (!this.password || !validPassword(this.password)) {
        this.$error('not a valid password');
        return;
      }
      await this.$store.dispatch('settings/xaPutAccount', {
        _id: this.id,
        username: this.username,
        password: this.password,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.account {
  padding: $space-lg;
}

.line {
  display: flex;
  align-items: center;
  padding: 0 $space-sm;
  .v-label,
  .v-input {
    margin: 0 !important;
    min-width: 20rem;
    text-align: left;
  }
  .v-label {
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
