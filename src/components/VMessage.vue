<template>
  <transition-group tag="div" name="v-message" class="v-message-wrapper">
    <div :class="['v-message', `v-message-${item.type}`]" v-for="item of messages" :key="item.id">
      <span>{{ item.text }}</span>
      <VButton type="full-height" @click="handleClose(item.id)"><VIconTimes /></VButton>
    </div>
  </transition-group>
</template>

<script>
/**
 * [vue 3]
 * may use vue 3 teleport feature to mount message inside body
 * instead of using Vue.extend() directly
 */
import VButton from '@/components/basic/VButton.vue';
import VIconTimes from '@/assets/icons/times.svg';

export default {
  name: 'VMessage',
  components: {
    VButton,
    VIconTimes,
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
.v-message {
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

  & > .v-button {
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
