<template>
  <div :class="['g-list', { 'g-list-dense': dense }]">
    <div class="g-list-item" v-for="item of data" :key="item.id">
      <div class="g-list-text">{{ item.text }}</div>
      <div class="g-list-label" v-if="item.label">{{ item.label }}</div>
      <div class="g-list-ctrl" v-if="control">
        <div class="g-list-ctrl-item">
          <GButton @click.prevent="$emit('edit', item.id)">
            <GIconEdit class="g-icon" />
          </GButton>
        </div>
        <div class="g-list-ctrl-item">
          <GButton @click.prevent="$emit('delete', item.id)">
            <GIconTrash class="g-icon" />
          </GButton>
        </div>
      </div>
      <div class="g-list-graph" v-if="graph">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import GButton from './GButton.vue';
import GIconEdit from '../assets/icons/edit.svg';
import GIconTrash from '../assets/icons/trash.svg';

export default {
  name: 'GList',
  components: {
    GButton,
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
    dense: Boolean, // dense list
    control: Boolean, // show control buttons
    graph: Boolean, // custom grid at the end
  },
};
</script>

<style lang="scss" src="./GList.scss">
</style>