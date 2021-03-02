<template>
  <div class="login">
    <ACard class="card">
      <AHeader :text="siteTitle" />
      <div class="line">
        <span>Username</span>
        <AInput v-model="username" :validator="validUsername" />
      </div>
      <div class="line">
        <span>Password</span>
        <AInput
          v-model="password"
          type="password"
          :validator="validPassword"
          @keyup.enter="handleLogin"
        />
      </div>
      <AButton class="submit" type="full-width" @click="handleLogin" :loading="awaitingLogin">
        Login
      </AButton>
    </ACard>
  </div>
</template>

<script>
import { validUsername, validPassword } from '@/utils/validators';
import { $error } from '@/plugins/message';

export default {
  name: 'Login',

  data() {
    return {
      username: '',
      password: '',

      awaitingLogin: false,
    };
  },
  computed: {
    // site title from environment variables
    siteTitle() {
      return process.env.VUE_APP_TITLE || 'Aofuji Analytics';
    },
  },

  methods: {
    validUsername,
    validPassword,
    /**
     * go login
     */
    async handleLogin() {
      this.awaitingLogin = true;
      // validators
      if (!this.username || !validUsername(this.username)) {
        this.$error('not a valid username');
        this.awaitingLogin = false;
        return;
      }
      if (!this.password || !validPassword(this.password)) {
        this.$error('not a valid password');
        this.awaitingLogin = false;
        return;
      }
      try {
        // post login
        await this.$store.dispatch('common/xaPostLogin', {
          username: this.username,
          password: this.password,
        });
      } catch {
        this.awaitingLogin = false;
        $error('wrong username or password');
        return;
      }
      this.awaitingLogin = false;
      // redirect to dashboard
      this.$router.push({
        name: 'Dashboard',
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.login {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.card {
  min-width: 30rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: $space-lg 0;
  .a-header {
    margin-bottom: $space-xs;
  }
}
.line {
  margin-top: $space-sm;
  span {
    display: inline-block;
    width: 7rem;
  }
}
.submit {
  margin-top: $space-sm;
}
</style>
