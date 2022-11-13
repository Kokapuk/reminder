<template>
  <div>
    <header :class="useThemeColorStore().themeColor">
      <div class="header-content">
        <h1 class="title">{{ useTitleStore().title }}</h1>
      </div>
      <NavButtons />
    </header>
    <Transition name="fade">
      <LoadingIndicator v-if="useLoadingStore().connectionLost">{{ Locales['establishing-connection'] }}</LoadingIndicator>
      <LoadingIndicator v-else-if="useLoadingStore().loading" />
    </Transition>
    <div v-if="!useLoadingStore().connectionLost" class="container">
      <RouterView v-slot="{ Component }">
        <Transition @enter="onEnter" @leave="onLeave" :name="$route.meta.transition" mode="out-in">
          <component :is="Component" :key="$route.path" />
        </Transition>
      </RouterView>
    </div>
  </div>
</template>

<script>
import { RouterLink } from 'vue-router';
import { RouterView } from 'vue-router';
import NavButtons from './components/NavButtons.vue';
import LoadingIndicator from './components/LoadingIndicator.vue';
import { useTitleStore } from './stores/title';
import { useThemeColorStore } from './stores/theme-color';
import { useRemindersStore } from './stores/reminders';
import { useLoadingStore } from './stores/loading';
import { useDbStore } from './stores/db';
import { useSettingsStore } from './stores/settings';
import { getAuth } from '@firebase/auth';
import Locales from './locales/index.json';

export default {
  components: {
    RouterLink,
    RouterView,
    NavButtons,
    LoadingIndicator,
  },
  data() {
    return {
      Locales: Locales[useSettingsStore().getLanguage()],
    };
  },
  methods: {
    useThemeColorStore,
    useTitleStore,
    useLoadingStore,
    onEnter(el, done) {
      setTimeout(() => {
        done();
      }, 200);
    },
    onLeave(el, done) {
      setTimeout(() => {
        done();
      }, 200);
    },
    checkReminders() {
      setInterval(async () => {
        if (useRemindersStore().reminding || !useRemindersStore().reminders || useLoadingStore().connectionLost || getAuth().currentUser === null) {
          return;
        }

        for (let i = 0; i < useRemindersStore().reminders.length; i++) {
          let reminder = useRemindersStore().reminders[i];

          if (reminder.reminded) {
            continue;
          }

          if (reminder.date === 0) {
            continue;
          }

          if (reminder.date > Date.now()) {
            continue;
          }

          useRemindersStore().reminding = true;
          this.$router.push(`reminder/${reminder.id}`);
          break;
        }
      }, 5000);
    },
  },
  created() {
    if (process.env.NODE_ENV === 'production') {
      window.addEventListener('mouseup', (e) => {
        if (e.button === 3 || e.button === 4) e.preventDefault();
      });
    }

    useDbStore().watchConnection();

    getAuth().onAuthStateChanged(async (user) => {
      if (!user) {
        useRemindersStore().reminders = null;
      }
    });

    requestAnimationFrame(this.checkReminders);
  },
};
</script>

<style scoped>
header {
  z-index: 100;
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  box-shadow: var(--shadow-small);
  -webkit-app-region: drag;
  transition: var(--transition-long);
}

.header-content {
  max-width: calc(100% - 150px);
  padding: 15px;
}

.title {
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.container {
  width: 100%;
  height: calc(100vh - 69px);
  padding-left: 100px;
  padding-right: 100px;
  padding-top: 25px;
  padding-bottom: 25px;
  overflow-y: auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: var(--transition);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.scale-up-enter-active,
.scale-up-leave-active,
.scale-down-enter-active,
.scale-down-leave-active {
  transition: var(--transition);
  pointer-events: none;
}

.scale-up-enter-from,
.scale-down-leave-to {
  opacity: 0;
  scale: 0.95;
}

.scale-up-leave-to,
.scale-down-enter-from {
  opacity: 0;
  scale: 1.05;
}
</style>
