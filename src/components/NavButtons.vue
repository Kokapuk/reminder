<template>
  <div class="nav-container">
    <!-- <RouterLink v-if="!username" to="/login"
      ><button class="nav-button">{{ Locales[useSettingsStore().getLanguage()].login }}</button></RouterLink
    > -->
    <button
      v-if="username"
      @click="() => $router.push('/settings')"
      class="nav-button"
      :disabled="loadingStore.connectionLost || !authStore.getCurrentUser().emailVerified">
      <Gear class="nav-button-content rotate-reaction" />
    </button>
    <button
      @click="
        () => {
          mainWindow.minimize();
        }
      "
      class="nav-button">
      <Minimize class="nav-button-content move-reaction" />
    </button>
    <button
      @click="
        () => {
          mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
        }
      "
      class="nav-button">
      <FullScreen v-if="!maximized" class="nav-button-content scale-up-reaction" />
      <FullScreenExit v-else class="nav-button-content scale-down-reaction" />
    </button>
    <button
      @click="
        () => {
          mainWindow.close();
        }
      "
      class="nav-button">
      <Close class="nav-button-content rotate-reaction" />
    </button>
  </div>
</template>

<script setup>
import Close from '../assets/icons/x.svg';
import FullScreen from '../assets/icons/fullscreen.svg';
import FullScreenExit from '../assets/icons/fullscreen-exit.svg';
import Minimize from '../assets/icons/minimize.svg';
import Gear from '../assets/icons/gear.svg';
import { ref } from 'vue';
import { useLoadingStore } from '../stores/loading';
import { useAuthStore } from '../stores/auth';

const loadingStore = useLoadingStore();
const authStore = useAuthStore();
const electron = window.require('@electron/remote');
const mainWindow = electron.getCurrentWindow();
const maximized = ref(mainWindow.isMaximized());

mainWindow.on('maximize', () => {
  maximized.value = true;
});

mainWindow.on('unmaximize', () => {
  maximized.value = false;
});
</script>

<script>
import { getAuth } from '@firebase/auth';
import { useAuthStore } from '../stores/auth';

export default {
  data() {
    return {
      username: null,
    };
  },
  methods: {
    async logout() {
      useLoadingStore().loading = true;
      const authStore = useAuthStore();

      await authStore.logout();
      await this.$router.push('/register');
      await this.$router.push('/login');
    },
  },
  created() {
    getAuth().onAuthStateChanged(async (user) => {
      if (user === null) {
        this.username = null;
        return;
      }

      this.username = user.displayName;
    });
  },
};
</script>

<style scoped>
.nav-container {
  display: flex;
  position: absolute;
  right: 0;
  top: 0;
}

.nav-button {
  cursor: pointer;
  background-color: rgba(var(--font-color), 0);
  height: 30px;
  color: rgb(var(--font-color));
  -webkit-app-region: no-drag;
  transition: var(--transition);
  padding-left: 10px;
  padding-right: 10px;
}

.nav-button-content {
  scale: 0.85;
}

.nav-button:hover {
  background-color: rgba(var(--font-color), 0.15);
}

.nav-button:active {
  background-color: rgba(var(--font-color), 0.3);
}

.rotate-reaction,
.scale-up-reaction,
.scale-down-reaction,
.move-reaction {
  transition: var(--transition);
}

.nav-button:hover .scale-up-reaction {
  scale: 1.1;
}

.nav-button:hover .scale-down-reaction {
  scale: 0.6;
}

.nav-button:hover .rotate-reaction {
  rotate: 90deg;
}

.nav-button:hover .move-reaction {
  margin-top: 10px;
}
</style>
