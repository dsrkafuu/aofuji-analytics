<template>
  <div :class="['v-list', `v-list-${type}`]">
    <div class="v-list-head"></div>
    <div class="v-list-item" v-for="item of data" :key="item.key || item.id || item.text">
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
      <div class="v-list-ctrl" v-if="control">
        <div class="v-list-ctrl-item">
          <VButton @click.prevent="$emit('edit', item.id)">
            <VIconEdit />
          </VButton>
        </div>
        <div class="v-list-ctrl-item">
          <VButton @click.prevent="$emit('delete', item.id)">
            <VIconTrash />
          </VButton>
        </div>
      </div>
      <div class="v-list-graph" v-if="graph">
        <slot :item="item"></slot>
      </div>
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
        if (!val.length) {
          return true;
        }
        for (let i = 0; i < val.length; i++) {
          if (!val[i].key && !val[i].id) {
            return false;
          }
        }
        return true;
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
    control: Boolean, // show control buttons
    graph: Boolean, // custom grid at the end
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
  }

  &-label {
    flex: 0 0 auto;
    width: 4.5rem;
    text-align: center;
  }

  &-ctrl {
    flex: 0 0 auto;
    display: flex;
    width: 8rem;
    justify-content: center;
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
