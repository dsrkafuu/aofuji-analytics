<template>
  <div class="website-edit">
    <GHeader :text="`${id ? 'editing' : 'adding'} website`">
      <GButton @click="handleExit"><GIconTimes /></GButton>
      <GButton @click="handleCheck"><GIconCheck /></GButton>
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
import { logInfo, logError } from '@/utils/loggers.js';
import { findObjectIndexInArray } from '@/utils/finders.js';

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
      return this.$store.state.SETTINGS.editing.id;
    },
  },
  methods: {
    /**
     * init website data with id when activated
     */
    initWebsite() {
      const sites = this.$store.state.SETTINGS.websites;
      const index = findObjectIndexInArray(sites, '_id', this.id);
      if (!Number.isNaN(index)) {
        const site = sites[index];
        this.name = site.name;
        this.domain = site.domain;
      }
    },
    /**
     * add a new website or modify website data
     */
    async handleCheck() {
      let res, buf;
      try {
        if (this.id) {
          res = await this.$axios.put(`/website/${this.id}`, {
            name: this.name,
            domain: this.domain,
            isPublic: this.isPublic,
          });
          this.$store.commit('UPDATE_WEBSITE', { id: this.id, data: res.data });
          buf = 'website modified';
        } else {
          res = await this.$axios.post('/website', {
            username: 'admin',
            name: this.name,
            domain: this.domain,
            isPublic: this.isPublic,
          });
          this.$store.commit('ADD_WEBSITE', { data: res.data });
          buf = 'new website added';
        }
        this.$info(buf);
        logInfo(buf, res.data._id);
        this.handleExit();
      } catch (e) {
        buf = `failed to ${this.id ? 'modify website' : 'add new website'}`;
        this.$error(buf);
        logError(buf, e);
      }
    },
    /**
     * exit editing
     */
    handleExit() {
      this.$store.commit('EXIT_EDITING');
    },
  },
  activated() {
    // if editing instead of creating
    if (this.id) {
      this.initWebsite();
    }
  },
  deactivated() {
    // clear data when exit
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
