<template>
  <div :class="['a-select', { 'a-select-active': active }]">
    <div class="a-select-input" @click="handleSwitch">
      <span>{{ selectedText }}</span>
      <AIconChevronUp v-if="active" />
      <AIconChevronDown v-else />
    </div>
    <ul class="a-select-list" v-show="active">
      <li v-for="key of Object.keys(map)" :key="key" @click="handleSelect(key)">
        {{ map[key] ? map[key].text : '' }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ASelect',

  props: {
    map: {
      type: Object,
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
      return this.map[this.value] ? this.map[this.value].text : '';
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
     * @param {string} key
     */
    handleSelect(key) {
      if (key !== this.value) {
        this.$emit('input', key);
      }
      this.active = false;
    },
  },
};
</script>

<style lang="scss">
.a-select {
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
  font-size: $font-size-sm;

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

    .a-icon {
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
    list-style-type: none;
    padding: $space-xs * 1.75 0;
    cursor: pointer;
    background-color: var(--color-bg);
    border-radius: $radius;
    box-shadow: var(--shadow-info);
    z-index: 50;

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
