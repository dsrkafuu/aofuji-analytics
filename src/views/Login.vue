<template>
  <div class="login">
    <GCard class="card">
      <GHeader :text="siteTitle"></GHeader>
      <div class="form">
        <span>Password</span>
        <GInput v-model="password" type="password" :validator="pwValidator"></GInput>
      </div>
      <GButton class="submit" type="full-width" @click="handleLogin">Login</GButton>
    </GCard>
  </div>
</template>

<script>
/* utils */
import { logInfo, logError } from '../utils/loggers.js';

export default {
  name: 'Login',
  data() {
    return {
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
     * validate password
     * @param {string} value
     * @return {boolean}
     */
    pwValidator(value) {
      if (value.length > 20) {
        return false;
      }
      return Boolean(/^[a-z0-9-_.]*$/gi.exec(value));
    },
    /**
     * try init user
     * @return {Promise<void>}
     */
    async initUser() {
      let res, buf;
      try {
        res = await this.$axios.get('/init');
        if (res.status === 201) {
          res = await this.$axios.post('/init', { pw: this.password });
          buf = 'admin inited';
          this.$info(buf);
          logInfo(buf);
        }
      } catch (e) {
        buf = 'failed to init user';
        this.$error(buf);
        logError(buf, e);
      }
    },
    async handleLogin() {
      if (this.password && this.pwValidator(this.password)) {
        await this.initUser();
        let res, buf;
        try {
          res = await this.$axios.post('/login', { pw: this.password });
          res = res.data;
          buf = `logging in as ${res.username}`;
          this.$info(buf);
          logInfo(buf);
        } catch (e) {
          buf = 'wrong username or password';
          this.$error(buf);
          logError(buf, e);
        }
      } else {
        this.$error('not a valid password');
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

  .g-header {
    margin-bottom: $space-xs;
  }

  .form span {
    margin-right: $space-base;
  }

  .submit {
    margin-top: $space-sm;
  }
}
</style>
