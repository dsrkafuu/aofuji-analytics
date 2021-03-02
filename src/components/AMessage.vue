<template>
  <transition-group tag="div" name="a-message" class="a-message-wrapper">
    <div :class="['a-message', `a-message-${item.type}`]" v-for="item of messages" :key="item.id">
      <span>{{ item.text }}</span>
      <AButton type="full-height" @click="handleClose(item.id)"><AIconTimes /></AButton>
    </div>
  </transition-group>
</template>

<script>
/**
 * [vue 3]
 * may use vue 3 teleport feature to mount message inside body
 * instead of using Vue.extend() directly
 */
import AButton from '@/components/basic/AButton.vue';
import AIconTimes from '@/assets/icons/times.svg';

export default {
  name: 'AMessage',
  components: {
    AButton,
    AIconTimes,
  },

  // data and method from outer `Vue.extend()`
  data() {
    return {
      messages: [],
    };
  },

  methods: {
    handleClose() {},
  },
};
</script>

<style lang="scss">
.a-message {
  &-wrapper {
    z-index: 99;
    position: fixed;
    right: 2rem;
    bottom: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 20rem;
  }

  background-color: var(--color-bg);
  width: 100%;
  height: 3rem;
  line-height: 3rem;
  box-shadow: var(--shadow-info);
  border-radius: $radius;
  padding-left: 1rem;
  display: flex;
  align-items: center;
  z-index: 99;

  & > span {
    flex: 1 1 auto;
  }

  & > .a-button {
    overflow: hidden;
  }

  &-error {
    box-shadow: var(--shadow-error);
  }

  // animation
  transition: all 300ms ease;

  &-enter,
  &-leave-to {
    opacity: 0;
  }

  &-leave-active {
    position: absolute;
  }
}
</style>
