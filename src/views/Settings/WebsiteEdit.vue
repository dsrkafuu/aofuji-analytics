<template>
  <div class="website-edit">
    <GHeader :text="`${id ? 'editing' : 'adding'} website`">
      <GButton @click="handleExit"><GIconTimes /></GButton>
      <GButton><GIconCheck /></GButton>
    </GHeader>
    <div class="website-edit-line" v-show="id">
      <span>id</span>
      <GLabel>{{ id }}</GLabel>
    </div>
    <div class="website-edit-line">
      <span>name</span>
      <GInput class="website-name" v-model="name" />
    </div>
    <div class="website-edit-line">
      <span>url</span>
      <GInput class="website-domain" v-model="domain" />
    </div>
  </div>
</template>

<script>
/* utils */
import { logInfo, logError } from '../../utils/logger.js';

export default {
  name: 'WebsiteEdit',
  data() {
    return {
      name: '',
      domain: '',
      isPublic: false,
    };
  },
  computed: {
    id() {
      return this.$store.state.editing.id;
    },
  },
  methods: {
    /**
     * fetch website data with id when activated
     * @param {string} id
     */
    async fetchWebsite(id) {
      let res;
      try {
        res = await this.$axios.get(`/website/${id}`);
      } catch (e) {
        this.$error(`failed to fetch website info`);
        logError(`failed to fetch websites ${id}`, e);
        res = null;
      }
      this.name = res.data.name || '';
      this.domain = res.data.domain || '';
    },
    /**
     * exit editing
     */
    handleExit() {
      this.$store.dispatch('EDIT_SETTING');
    },
  },
  async activated() {
    // if editing instead of creating
    if (this.id) {
      await this.fetchWebsite(this.id);
      logInfo(`website ${this.id} initialized`);
    }
  },
  deactivated() {
    this.name = '';
    this.domain = '';
  },
};
</script>

<style lang="scss">
.website-edit {
  padding: $space-lg;

  .website-edit-line {
    display: flex;
    align-items: center;
    padding: 0 $space-sm;

    .g-label,
    .g-input {
      margin: 0 !important;
      min-width: 20rem;
      text-align: left;
    }

    .g-label {
      font-size: $font-size-sm;
      height: 2rem;
      line-height: 2rem;
      padding: 0 $space-xs * 1.75;
    }

    span:first-child {
      font-weight: 500;
      height: 2.5rem;
      line-height: 2.5rem;
      width: 10rem;
    }
  }
}
</style>
