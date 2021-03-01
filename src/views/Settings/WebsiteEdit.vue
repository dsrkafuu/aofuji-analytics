<template>
  <div class="website-edit">
    <VHeader :text="`${_id ? 'Edit' : 'Add'} Website`">
      <VButton @click="handleExit">
        <VIconTimes />
      </VButton>
      <VButton @click="handleCheck" :loading="awaitingCheck">
        <VIconCheck />
      </VButton>
    </VHeader>
    <div class="line" v-show="_id">
      <span class="keyname">ID</span>
      <VLabel>{{ _id }}</VLabel>
    </div>
    <div class="line">
      <span class="keyname">Name</span>
      <VInput class="name" v-model="name" />
    </div>
    <div class="line">
      <span class="keyname">URL</span>
      <VInput class="domain" v-model="url" />
    </div>
    <div class="line">
      <span class="keyname">Base URL</span>
      <VInput class="domain" v-model="base" />
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
      isPublic: false,

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
    this.isPublic = false;

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
        this.isPublic = editing.isPublic || false;
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
          isPublic: this.isPublic,
        });
      } else {
        await this.$store.dispatch('settings/xaPostWebsite', {
          name: this.name,
          url: this.url,
          base: this.base,
          isPublic: this.isPublic,
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
  .v-label,
  .v-input {
    margin: 0 !important;
    min-width: 20rem;
    text-align: left;
  }
  .v-label {
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
