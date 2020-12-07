<template>
  <div class="settings">
    <div class="settings-ctrl">
      <GCard>
        <GButton
          v-for="(tab, index) of tabs"
          :key="tab.name"
          type="full-width"
          @click.prevent="handleTabChange(index)"
          :active="index === currentTab"
        >
          {{ tab.name }}
        </GButton>
      </GCard>
    </div>
    <div class="settings-content">
      <GCard>
        <keep-alive>
          <component :is="tabs[currentTab].component"></component>
        </keep-alive>
      </GCard>
    </div>
  </div>
</template>

<script>
/* components */
import GCard from '../../components/GCard.vue';
import GButton from '../../components/GButton.vue';
import UserSettings from './UserSettings.vue';
import WebsiteSettings from './WebsiteSettings.vue';
import About from './About.vue';

export default {
  name: 'Settings',
  components: {
    GCard,
    GButton,
    UserSettings,
    WebsiteSettings,
    About,
  },
  data() {
    return {
      tabs: [
        { name: 'Users', component: UserSettings },
        { name: 'Websites', component: WebsiteSettings },
        { name: 'About', component: About },
      ],
      currentTab: 0,
    };
  },
  methods: {
    /**
     * change current tab
     * @param {Number} tabIndex
     */
    handleTabChange(tabIndex) {
      this.currentTab = tabIndex;
    },
  },
};
</script>

<style lang="scss">
.settings {
  display: flex;
  margin: $space-lg;
}

.settings-ctrl {
  flex: 0 0 20%;

  .g-card {
    padding: $space-base 0;
  }
}

.settings-content {
  flex: 1 1 auto;
  margin-left: $space-lg;
}
</style>