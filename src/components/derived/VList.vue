<template>
  <div :class="['v-list', `v-list-${type}`]">
    <div class="v-list-item" v-for="item of data" :key="item.key || item.id || item[0]">
      <!-- key-value pair list -->
      <template v-if="Array.isArray(item) && item.length === 2">
        <div class="v-list-text">{{ item[0] }}</div>
        <div class="v-list-count">{{ item[1] }}</div>
      </template>

      <!-- object list -->
      <template v-else>
        <div v-if="type === 'extend'" class="v-list-text-wrapper">
          <div class="v-list-text">{{ item.text }}</div>
          <div class="v-list-sub">{{ item.sub }}</div>
        </div>
        <div v-else class="v-list-text">{{ item.text }}</div>
        <div class="v-list-label" v-if="item.label">
          <span class="v-label">
            <VLabel>{{ item.label }}</VLabel>
          </span>
        </div>
      </template>

      <!-- custom row item -->
      <template v-if="custom">
        <slot :item="item"></slot>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VList',
  props: {
    data: {
      type: Array,
      validator: (val) => {
        let res = true;
        val.forEach((item) => {
          if ((Array.isArray(item) && item.length === 2) || (item.text && (item.key || item.id))) {
            return;
          }
          res = false;
        });
        return res;
      },
      required: true,
    },
    type: {
      type: String,
      validator: (val) => {
        return ['extend', 'dense', 'default'].includes(val);
      },
      default: 'default', // common list by default
    },
    custom: Boolean, // custom list
  },
};
</script>

<style lang="scss">
.v-list {
  display: flex;
  flex-direction: column;

  &-item {
    display: flex;
    height: $list-item-height;
    line-height: $list-item-height;
  }

  &-text {
    padding: 0 $space-sm;
    flex: 1 1 auto;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &-count {
    padding-right: $space-sm;
    flex: 0 0 auto;
    text-align: right;
  }

  &-label {
    flex: 0 0 auto;
    width: 4.5rem;
    text-align: center;
  }

  /* dense list */
  &-dense {
    .v-list-item {
      height: $list-item-height-sm;
      line-height: $list-item-height-sm;
      font-size: $font-size-sm;
    }
  }

  /* extend list */
  &-extend {
    .v-list-item {
      height: $list-item-height + $list-item-height-sm;
    }

    .v-list-text-wrapper {
      flex: 1 1 auto;
      display: flex;
      flex-direction: column;
    }

    .v-list-text {
      height: $list-item-height;
      line-height: $list-item-height;
    }

    .v-list-sub {
      height: $list-item-height-sm;
      line-height: initial;
      font-size: $font-size-sm;
      padding: 0 $space-sm;
    }
  }
}
</style>
