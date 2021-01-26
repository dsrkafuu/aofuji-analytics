<template>
  <transition-group tag="div" name="g-message" class="g-message-wrapper">
    <div :class="['g-message', `g-message-${item.type}`]" v-for="item of messages" :key="item.id">
      <span>{{ item.text }}</span>
      <GButton type="full-height" @click="handleClose(item.id)"><GIconTimes /></GButton>
    </div>
  </transition-group>
</template>

<script>
/**
 * [vue 3]
 * compatible
 * may use vue 3 teleport feature to mount message inside body
 * instead of using Vue.extend() directly
 */
export default {
  name: 'GMessage',
  computed: {
    messages() {
      const messages = [...this.$store.state.MESSAGE.messages].reverse();
      return messages;
    },
  },
  methods: {
    /**
     * close this message
     * @param {string} id
     */
    handleClose(id) {
      this.$store.dispatch('CLOSE_MESSAGE', { id });
    },
  },
};
</script>

<style lang="scss">
.g-message-wrapper {
  position: fixed;
  right: 2rem;
  bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 20rem;
}

.g-message {
  background-color: var(--color-bg);
  width: 100%;
  height: 3rem;
  line-height: 3rem;
  box-shadow: var(--shadow-info);
  border-radius: $radius;
  padding-left: 1rem;
  display: flex;
  align-items: center;

  & > span {
    flex: 1 1 auto;
  }

  & > .g-button {
    overflow: hidden;
  }
}

.g-message-error {
  box-shadow: var(--shadow-error);
}

/* animation */
.g-message {
  transition: all 500ms ease;
}
.g-message-enter,
.g-message-leave-to {
  opacity: 0;
}
.g-message-leave-active {
  position: absolute;
}
</style>
