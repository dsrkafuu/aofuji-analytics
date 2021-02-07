<template>
  <div class="login">
    <VCard class="card">
      <VHeader :text="siteTitle" />
      <div class="line">
        <span>Username</span>
        <VInput v-model="username" :validator="validUsername" @keyup.enter="handleLogin" />
      </div>
      <div class="line">
        <span>Password</span>
        <VInput
          v-model="password"
          type="password"
          :validator="validPassword"
          @keyup.enter="handleLogin"
        />
      </div>
      <VButton class="submit" type="full-width" @click="handleLogin">Login</VButton>
    </VCard>
  </div>
</template>

<script>
/* utils */
import { logInfo, logError } from '@/utils/loggers.js';
import { validUsername, validPassword } from '@/utils/validators.js';

export default {
  name: 'Login',
  data() {
    return {
      validUsername,
      validPassword,
      username: '',
      password: '',
    };
  },
  computed: {
    // site title from environment variables
    siteTitle() {
      return process.env.VUE_APP_TITLE || 'Goose Analytics';
    },
  },
  methods: {
    /**
     * @return {Promise<void>}
     */
    async initAccount() {
      let res;
      try {
        res = await this.$api.get('/login/init');
        if (res.status === 201) {
          let res;
          try {
            res = await this.$api.post('/login/init', {
              username: this.username,
              password: this.password,
            });
            logInfo(res.data);
          } catch (e) {
            this.$error('failed to init account');
            logError(e);
          }
        }
      } catch (e) {
        this.$error('failed to init account');
        logError(e);
      }
    },
    /**
     * @return {Promise<void>}
     */
    async handleLogin() {
      if (!this.username || !validUsername(this.username)) {
        this.$error('not a valid username');
        return;
      }
      if (!this.password || !validPassword(this.password)) {
        this.$error('not a valid password');
        return;
      }
      await this.initAccount();
      let res;
      try {
        res = await this.$api.post('/login', {
          username: this.username,
          password: this.password,
        });
        this.$info(`logging in as ${res.data?.username}`);
        logInfo(res.data);
        // write data to vuex
        this.$store.commit('M_COMMON_ACCOUNT', res.data);
        this.$router.push({
          name: 'Realtime',
        });
      } catch (e) {
        this.$error('wrong username or password');
        logError(e);
      }
    },
  },
};
</script>

<style lang="scss">
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

  .card {
    min-width: 30rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: $space-lg 0;
  }

  .v-header {
    margin-bottom: $space-xs;
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
}
</style>
