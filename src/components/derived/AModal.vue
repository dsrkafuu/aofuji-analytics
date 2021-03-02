<template>
  <div class="a-modal" v-if="show">
    <ACard class="a-modal-card">
      <div class="a-modal-body">
        <template v-if="custom">
          <slot></slot>
        </template>
        <template v-else>
          <span class="a-modal-text">{{ value }}</span>
        </template>
      </div>
      <div class="a-modal-ctrl">
        <div class="a-modal-ctrl-item" v-if="type === 'confirm'">
          <AButton @click="$emit('cancel')">
            <AIconTimes />
          </AButton>
        </div>
        <div class="a-modal-ctrl-item">
          <AButton @click="$emit('confirm')">
            <AIconCheck />
          </AButton>
        </div>
      </div>
    </ACard>
  </div>
</template>

<script>
export default {
  name: 'AModal',
  props: {
    show: { type: Boolean, default: false },
    type: {
      type: String,
      validator: (val) => {
        return ['alert', 'confirm'].includes(val); // modal type available
      },
      default: 'confirm', // confirm modal by default
    },
    value: { type: String },
    custom: { type: Boolean }, // custom modal body
  },
};
</script>

<style lang="scss">
.a-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;

  .a-card {
    position: relative;
    flex-direction: column;
    display: flex;
    min-width: $modal-min-width;
    min-height: $modal-min-height;
    padding: $space-base;
  }

  &-ctrl {
    flex: 0 0 auto;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  &-body {
    position: relative;
    flex: 1 1 auto;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &-text {
    display: block;
    text-align: center;
  }
}
</style>
