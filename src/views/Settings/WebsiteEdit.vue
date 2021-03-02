<template>
  <div class="website-edit">
    <AHeader :text="`${_id ? 'Edit' : 'Add'} Website`">
      <AButton @click="handleExit">
        <AIconTimes />
      </AButton>
      <AButton @click="handleCheck" :loading="awaitingCheck">
        <AIconCheck />
      </AButton>
    </AHeader>
    <div class="line" v-show="_id">
      <span class="keyname">ID</span>
      <ALabel>{{ _id }}</ALabel>
    </div>
    <div class="line">
      <span class="keyname">Name</span>
      <AInput class="name" v-model="name" />
    </div>
    <div class="line">
      <span class="keyname">URL</span>
      <AInput class="domain" v-model="url" />
    </div>
    <div class="line">
      <span class="keyname">Base URL</span>
      <AInput class="domain" v-model="base" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'WebsiteEdit',

  data() {
    return {
      name: '',
      url: '',
      base: '',

      awaitingCheck: false,
    };
  },
  computed: {
    _id() {
      return this.$store.state.settings.editWebsite?._id;
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
    this.url = '';
    this.base = '';

    this.awaitingCheck = false;
  },

  methods: {
    /**
     * init website data with id when activated
     */
    initWebsite() {
      const editing = this.$store.state.settings.editWebsite;
      if (editing) {
        this.name = editing.name || '';
        this.url = editing.url || '';
        this.base = editing.base || '';
      }
    },
    /**
     * add a new website or modify website data
     */
    async handleCheck() {
      this.awaitingCheck = true;
      if (this._id) {
        await this.$store.dispatch('settings/xaPutWebsite', {
          name: this.name,
          url: this.url,
          base: this.base,
        });
      } else {
        await this.$store.dispatch('settings/xaPostWebsite', {
          name: this.name,
          url: this.url,
          base: this.base,
        });
      }
      this.awaitingCheck = false;
      this.handleExit();
    },
    /**
     * exit editing
     */
    handleExit() {
      this.$store.commit('settings/xmSetEditWebsite', {});
    },
  },
};
</script>

<style lang="scss" scoped>
.website-edit {
  padding: $space-lg;
}

.line {
  display: flex;
  align-items: center;
  padding: 0 $space-sm;

  .a-label,
  .a-input {
    margin: 0 !important;
    min-width: 20rem;
    text-align: left;
  }

  .a-label {
    font-size: $font-size-sm;
    height: 2rem;
    line-height: 2rem;
    padding: 0 $space-xs * 1.75;
  }
}

.keyname {
  font-weight: 500;
  height: 2.5rem;
  line-height: 2.5rem;
  width: 10rem;
}
</style>
