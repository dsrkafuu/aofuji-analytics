<template>
  <div :class="['g-select', { 'g-select-active': active }]">
    <div class="g-select-input" @click="handleSwitch">
      <span>{{ selectedText }}</span>
      <GIconChevronUp v-if="active" />
      <GIconChevronDown v-else />
    </div>
    <ul class="g-select-list" v-show="active">
      <li v-for="item of data" :key="item.value" @click="handleSelect(item)">
        {{ item.text }}
      </li>
    </ul>
  </div>
</template>

<script>
/* utils */
import { findObjectIndexInArray } from '@/utils/finders';

export default {
  name: 'GSelect',
  props: {
    data: {
      type: Array,
      required: true,
    },
    // for v-model
    value: {
      required: true,
    },
  },
  data() {
    return {
      active: false,
    };
  },
  computed: {
    selectedText() {
      const value = this.value;
      if (value) {
        const index = findObjectIndexInArray(this.data, 'value', value);
        if (!Number.isNaN(index)) {
          return this.data[index].text;
        } else {
          return '';
        }
      } else {
        return '';
      }
    },
  },
  methods: {
    /**
     * switch active status
     */
    handleSwitch() {
      this.active = !this.active;
    },
    /**
     * handle li select
     * @param {Object} item
     */
    handleSelect(item) {
      this.text = item.text;
      this.$emit('input', item.value);
      this.active = false;
    },
  },
};
</script>

<style lang="scss">
.g-select {
  display: inline-block;
  background-color: var(--color-wrapper);
  height: $select-height;
  border-radius: $radius;
  line-height: $select-height;
  position: relative;
  cursor: pointer;
  user-select: none;
  min-width: $select-min-width;
  max-width: $select-max-width;

  &-input {
    margin: $space-xs $space-xs * 1.75;
    height: $select-inner-height;
    line-height: $select-inner-height;
    position: relative;
    display: flex;
    align-items: center;

    span {
      flex: 1 1 auto;
      margin-right: $space-xs * 1.75;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .g-icon {
      flex: 0 0 auto;
    }
  }

  &-list {
    position: absolute;
    top: $select-height;
    left: 0;
    margin: 0;
    min-width: $select-min-width;
    max-width: $select-max-width;
    background-color: red;
    list-style-type: none;
    padding: $space-xs * 1.75 0;
    cursor: pointer;
    background-color: var(--color-bg);
    border-radius: $radius;
    box-shadow: var(--shadow-info);

    li {
      padding: 0 $space-xs * 1.75;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;

      &:hover {
        background-color: var(--color-hover);
      }
    }
  }
}
</style>
