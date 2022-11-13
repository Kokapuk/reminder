<template>
  <div class="center">
    <div>
      <span class="text-gray text-light d-block text-center"
        >{{ Locales['you-have-to-verify'] }}<br />
        {{ Locales['check-your-email'] }}<br />
        {{ Locales['press-button-below'] }}</span
      >
      <div class="center-y">
        <button @click="signOut" class="button mt-15 sea-green">{{ Locales['i-have-verified'] }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import { useLoadingStore } from '../stores/loading';
import { useAuthStore } from '../stores/auth';
import { useSettingsStore } from '../stores/settings';
import Locales from '../locales/index.json';

export default {
  data() {
    return {
      Locales: Locales[useSettingsStore().getLanguage()],
    };
  },
  async created() {
    useLoadingStore().loading = true;
    const authStore = useAuthStore();
    await authStore.verifyEmail();
    useLoadingStore().loading = false;
  },
  methods: {
    useSettingsStore,
    async signOut() {
      useLoadingStore().loading = true;
      const authStore = useAuthStore();
      await authStore.logout();
      await this.$router.push('/login');
    },
  },
};
</script>
