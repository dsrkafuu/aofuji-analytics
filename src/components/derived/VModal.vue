<template>
  <div class="v-modal" v-if="show">
    <VCard class="v-modal-card">
      <div class="v-modal-body">
        <template v-if="custom">
          <slot></slot>
        </template>
        <template v-else>
          <span class="v-modal-text">111</span>
        </template>
      </div>
      <div class="v-modal-ctrl">
        <div class="v-modal-ctrl-item" v-if="type === 'confirm'">
          <VButton @click="$emit('cancel')">
            <VIconTimes />
          </VButton>
        </div>
        <div class="v-modal-ctrl-item">
          <VButton @click="$emit('confirm')">
            <VIconCheck />
          </VButton>
        </div>
      </div>
    </VCard>
  </div>
</template>

<script>
export default {
  name: 'VModal',
  props: {
    show: { type: Boolean, default: false },
    type: {
      type: String,
      validator: (val) => {
        return ['alert', 'confirm'].includes(val); // modal type available
      },
      default: 'confirm', // confirm modal by default
    },
    custom: { type: Boolean }, // custom modal body
  },
};
</script>

<style lang="scss">
.v-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;

  .v-card {
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
