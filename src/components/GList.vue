<template>
  <div :class="['g-list', `g-list-${type}`]">
    <div class="g-list-head"></div>
    <div class="g-list-item" v-for="item of data" :key="item.id">
      <div v-if="type === 'extend'" class="g-list-text-wrapper">
        <div class="g-list-text">{{ item.text }}</div>
        <div class="g-list-sub">{{ item.sub }}</div>
      </div>
      <div v-else class="g-list-text">{{ item.text }}</div>
      <div class="g-list-label" v-if="item.label">
        <span class="g-label">
          <GLabel>{{ item.label }}</GLabel>
        </span>
      </div>
      <div class="g-list-ctrl" v-if="control">
        <div class="g-list-ctrl-item">
          <GButton @click.prevent="$emit('edit', item.id)">
            <GIconEdit />
          </GButton>
        </div>
        <div class="g-list-ctrl-item">
          <GButton @click.prevent="$emit('delete', item.id)">
            <GIconTrash />
          </GButton>
        </div>
      </div>
      <div class="g-list-graph" v-if="graph">
        <slot name="graph" :data="data" :dense="dense"></slot>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * [vue 3]
 * unknown
 * vue-svg-loader need to be upgraded
 */

import GButton from './GButton.vue';
import GLabel from './GLabel.vue';
import GIconEdit from '../assets/icons/edit.svg';
import GIconTrash from '../assets/icons/trash.svg';

export default {
  name: 'GList',
  components: {
    GButton,
    GLabel,
    GIconEdit,
    GIconTrash,
  },
  props: {
    data: {
      type: Array,
      validator: (val) => {
        if (!val.length) {
          return true;
        }
        for (let i = 0; i < val.length; i++) {
          if (!val[i].id || !val[i].text) {
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
.g-list {
  display: flex;
  flex-direction: column;
}

.g-list-item {
  display: flex;
  height: $list-item-height;
  line-height: $list-item-height;
}

.g-list-text {
  padding: 0 $space-sm;
  flex: 1 1 auto;
}

.g-list-label {
  flex: 0 0 auto;
  width: 4.5rem;
  text-align: center;
}

.g-list-ctrl {
  flex: 0 0 auto;
  display: flex;
  width: 8rem;
  justify-content: center;
}

/* dense list */

.g-list-dense {
  .g-list-item {
    height: $list-item-height-sm;
    line-height: $list-item-height-sm;
    font-size: $font-size-sm;
  }
}

/* extend list */

.g-list-extend {
  .g-list-item {
    height: $list-item-height + $list-item-height-sm;
  }

  .g-list-text-wrapper {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
  }

  .g-list-text {
    height: $list-item-height;
    line-height: $list-item-height;
  }

  .g-list-sub {
    height: $list-item-height-sm;
    line-height: initial;
    font-size: $font-size-sm;
    padding: 0 $space-sm;
  }
}
</style>
