<template>
  <transition-group tag="div" name="g-message" class="g-message-wrapper">
    <div :class="['g-message', `g-message-${item.type}`]" v-for="item of messages" :key="item.id">
      <span>{{ item.text }}</span>
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
    status() {
      return this.$store.state.messageStatus;
    },
    messages() {
      return this.$store.state.messages;
    },
  },
};
</script>

<style lang="scss">
.g-message-wrapper {
  position: absolute;
  right: 2rem;
  top: 2rem;
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
  padding: 0 1rem;
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
