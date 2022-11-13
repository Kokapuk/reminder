<template>
  <div>
    <div class="sticker" :class="reminder.color">
      <h1>{{ reminder.title }}</h1>
      <span class="d-block mt-15">{{ reminder.text }}</span>
    </div>
    <div class="hover-right mt-25">
      <button @click="() => edit()" class="button orange">{{ Locales.edit }}</button>
      <button @click="() => markAsReminded()" class="button sea-green ms-10">{{ Locales.ok }}</button>
    </div>
  </div>
</template>

<script>
import Alarm from '../assets/alarm.mp3';
import { useRemindersStore } from '../stores/reminders';
import { useThemeColorStore } from '../stores/theme-color';
import { useLoadingStore } from '../stores/loading';
import { useDbStore } from '../stores/db';
import { useSettingsStore } from '../stores/settings';
import Locales from '../locales/index.json';

const electron = window.require('@electron/remote');
const { ipcRenderer } = window.require('electron');
const fs = window.require('fs');

export default {
  data() {
    return {
      reminder: { ...useRemindersStore().reminders.find((item) => item.id == this.$route.params.id) },
      audio: useSettingsStore().getRemindeAudio() ? new Audio(useSettingsStore().getRemindeAudio()) : new Audio(Alarm),
      Locales: Locales[useSettingsStore().getLanguage()],
    };
  },
  async created() {
    useThemeColorStore().themeColor = this.reminder.color;

    if (!electron.getCurrentWindow().isFocused() && !useSettingsStore().getShowWindowOnReminder()) {
      this.notificate(this.reminder.text);
    }

    if (useSettingsStore().getShowWindowOnReminder()) {
      ipcRenderer.send('show-or-restore');
    }

    if (useSettingsStore().getRemindeAudio()) {
      if (!fs.existsSync(useSettingsStore().getRemindeAudio())) {
        this.audio = new Audio(Alarm);
        useSettingsStore().removeReminderAudio();
      }
    }

    this.audio.onended = () => {
      this.audio.currentTime = 0;
      this.audio.play();
    };

    this.audio.onpause = () => {
      if (this.audio === null) {
        return;
      }

      this.audio.play();
    };

    this.audio.volume = useSettingsStore().getVolume();
    this.audio.play();
  },
  methods: {
    async leave() {
      useRemindersStore().reminding = false;
      await this.$router.push('/');
    },
    async markAsReminded() {
      useLoadingStore().loading = true;
      this.reminder.reminded = true;
      const dbStore = useDbStore();

      await dbStore.updateReminder(this.reminder);
      this.leave();
    },
    async edit() {
      await this.$router.push(`/edit/${this.reminder.id}`);
    },
    notificate(body) {
      var notification = new electron.Notification({
        title: this.Locales['there-is-something'],
        body,
        timeoutType: 'never',
        icon: __dirname + '\\assets\\icon.ico',
      });
      notification.show();
      notification.on('click', () => {
        ipcRenderer.send('show-or-restore');
      });
    },
  },
  beforeUnmount() {
    this.audio.pause();
    this.audio = null;
  },
};
</script>

<style scoped>
.sticker {
  max-width: 100%;
  padding: 25px;
}

.hover-right {
  display: flex;
  justify-content: flex-end;
}
</style>
