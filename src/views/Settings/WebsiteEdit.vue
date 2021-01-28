<template>
  <div class="website-edit">
    <GHeader :text="`${_id ? 'Edit' : 'Add'} Website`">
      <GButton @click="handleExit"><GIconTimes /></GButton>
      <GButton @click="handleCheck"><GIconCheck /></GButton>
    </GHeader>
    <div class="line" v-show="_id">
      <span class="keyname">id</span>
      <GLabel>{{ _id }}</GLabel>
    </div>
    <div class="line">
      <span class="keyname">name</span>
      <GInput class="name" v-model="name" />
    </div>
    <div class="line">
      <span class="keyname">url</span>
      <GInput class="domain" v-model="domain" />
    </div>
  </div>
</template>

<script>
/* utils */
import { logInfo, logError } from '@/utils/loggers.js';

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
    _id() {
      return this.$store.state.WEBSITE.editing?._id;
    },
  },
  methods: {
    /**
     * init website data with id when activated
     */
    initWebsite() {
      const editing = this.$store.state.WEBSITE.editing;
      if (editing) {
        this.name = editing.name || '';
        this.domain = editing.domain || '';
      }
    },
    /**
     * add a new website or modify website data
     */
    async handleCheck() {
      let res, buf;
      try {
        if (this._id) {
          res = await this.$axios.put(`/website/${this._id}`, {
            name: this.name,
            domain: this.domain,
            isPublic: this.isPublic,
          });
          this.$store.commit('UPDATE_WEBSITE', { _id: this._id, data: res.data });
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
        logInfo(res.data);
        this.handleExit();
      } catch (e) {
        this.$error(`failed to ${this._id ? 'modify website' : 'add new website'}`);
        logError(e);
      }
    },
    /**
     * exit editing
     */
    handleExit() {
      this.$store.commit('EXIT_EDIT_WEBSITE');
    },
  },
  activated() {
    // if editing instead of creating
    if (this._id) {
      this.initWebsite();
    }
  },
  deactivated() {
    // clear data when exit
    this.name = '';
    this.domain = '';
    this.isPublic = false;
  },
};
</script>

<style lang="scss">
.website-edit {
  padding: $space-lg;

  .line {
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

    .keyname {
      font-weight: 500;
      height: 2.5rem;
      line-height: 2.5rem;
      width: 10rem;
    }
  }
}
</style>
