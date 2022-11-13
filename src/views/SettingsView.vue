<template>
  <div>
    <div v-if="!useLoadingStore().loading">
      <h1 class="mb-20">{{ Locales['account-managment'] }}</h1>
      <div class="grid">
        <span class="param-name">{{ Locales.username }}</span>
        <div>
          <input
            @input="() => (usernameInvalidReason = null)"
            v-model.trim="username"
            class="input param-input me-15"
            :class="usernameInvalidReason && 'invalid'"
            type="text" />
          <button @click="saveName" class="button param-button sea-green">{{ Locales.save }}</button>
          <span v-if="usernameInvalidReason" class="d-block text-lignt text-salmon-pink mt-10">{{ usernameInvalidReason }}</span>
        </div>

        <span class="param-name">{{ Locales.password }}</span>
        <button @click="() => (modalShow = true)" class="button solo-button orange">{{ Locales['change-password'] }}</button>

        <span class="param-name">{{ Locales.account }}</span>
        <button @click="signOut" class="button salmon-pink solo-button">{{ Locales['leave-account'] }}</button>
      </div>
      <h1 class="mb-20 mt-50">{{ Locales['app-options'] }}</h1>
      <div class="grid">
        <span class="param-name">{{ Locales.language }}</span>
        <div>
          <select @change="changeLanguage">
            <option value="en" :selected="useSettingsStore().getLanguage() === 'en'">English</option>
            <option value="ru" :selected="useSettingsStore().getLanguage() === 'ru'">Русский</option>
            <option value="uk" :selected="useSettingsStore().getLanguage() === 'uk'">Український</option>
            <option value="be" :selected="useSettingsStore().getLanguage() === 'be'">Беларускі</option>
            <option value="iw" :selected="useSettingsStore().getLanguage() === 'iw'">עברית</option>
          </select>
        </div>

        <span class="param-name">{{ Locales['reminder-audio'] }}</span>
        <div>
          <input :value="reminderAudioPath" readonly class="input param-input me-15" type="text" />
          <div class="d-inline">
            <button @click="chooseReminderAudio" class="button sea-green me-10">{{ Locales.choose }}</button>
            <button @click="resetReminderAudio" class="button salmon-pink">{{ Locales.reset }}</button>
          </div>
        </div>

        <span class="param-name">{{ Locales['reminder-volume'] }}</span>
        <input
          :value="useSettingsStore().getVolume() * 100"
          @input="
            (event) => {
              if (audio.paused) {
                audio.play();
              }

              audio.volume = event.target.valueAsNumber / 100;
            }
          "
          @mouseup="(event) => useSettingsStore().setVolume(event.target.valueAsNumber / 100)"
          type="range"
          min="1"
          max="100" />

        <span class="param-name">{{ Locales['show-on-reminder'] }}</span>
        <label class="switch">
          <input
            @change="(event) => useSettingsStore().setShowWindowOnReminder(event.target.checked)"
            :checked="useSettingsStore().getShowWindowOnReminder()"
            type="checkbox" />
          <span class="slider sea-green" />
        </label>

        <span class="param-name">{{ Locales['start-minimized'] }}</span>
        <label class="switch">
          <input
            @change="(event) => useSettingsStore().setStartMinimized(event.target.checked)"
            :checked="useSettingsStore().getStartMinimized()"
            type="checkbox" />
          <span class="slider sea-green" />
        </label>
      </div>
      <div class="right mt-50">
        <RouterLink to="/">
          <button class="button orange">{{ Locales.close }}</button>
        </RouterLink>
      </div>
      <Modal :title="Locales['password-change']" :show="modalShow">
        <form @submit.prevent="changePassword">
          <input
            @input="() => (changePasswordFormInvalidReason = null)"
            v-model="currentPassword"
            id="current-password"
            class="input mb-15 w-100"
            type="password"
            :placeholder="Locales['current-password']"
            required
            minlength="8" />
          <input
            @input="() => (changePasswordFormInvalidReason = null)"
            v-model="newPassword"
            id="new-password"
            class="input w-100"
            type="password"
            :placeholder="Locales['new-password']"
            required
            minlength="8" />
          <span v-if="changePasswordFormInvalidReason" class="d-block mt-10 text-light text-salmon-pink">{{ changePasswordFormInvalidReason }}</span>
          <div class="right mt-25">
            <button type="submit" class="button sea-green ms-10">{{ Locales.save }}</button>
            <button type="button" @click="() => (modalShow = false)" class="button">{{ Locales.cancel }}</button>
          </div>
        </form>
      </Modal>
    </div>
  </div>
</template>

<script>
import Modal from '../components/Modal.vue';
import Alarm from '../assets/alarm.mp3';
import { useLoadingStore } from '../stores/loading';
import { useAuthStore } from '../stores/auth';
import { useSettingsStore } from '../stores/settings';
import Locales from '../locales/index.json';

const { dialog } = window.require('@electron/remote');
const fs = window.require('fs');

export default {
  components: { Modal },
  data() {
    return {
      Locales: Locales[useSettingsStore().getLanguage()],
      username: '',
      usernameInvalidReason: null,
      modalShow: false,
      currentPassword: '',
      newPassword: '',
      reminderAudioPath: useSettingsStore().getRemindeAudio() ? useSettingsStore().getRemindeAudio() : Locales[useSettingsStore().getLanguage()].default,
      changePasswordFormInvalidReason: null,
      audio: useSettingsStore().getRemindeAudio() ? new Audio(useSettingsStore().getRemindeAudio()) : new Audio(Alarm),
    };
  },
  created() {
    useLoadingStore().loading = true;
    this.username = useAuthStore().getCurrentUser().displayName;

    if (this.reminderAudioPath !== this.Locales.default) {
      if (!fs.existsSync(this.reminderAudioPath)) {
        this.resetReminderAudio();
      }
    }

    window.onkeydown = async (event) => {
      if (event.key === 'Escape') {
        await this.$router.push('/');
      }
    };

    useLoadingStore().loading = false;
  },
  methods: {
    useLoadingStore,
    useSettingsStore,
    async changeLanguage(event) {
      useSettingsStore().setLanguage(event.target.value);
      await this.$router.go();
    },
    async saveName() {
      useLoadingStore().loading = true;

      if (this.username.length < 3) {
        this.usernameInvalidReason = this.Locales['username-must-be-3'];
        useLoadingStore().loading = false;
        return;
      }

      if (this.username === useAuthStore().getCurrentUser().displayName) {
        useLoadingStore().loading = false;
        return;
      }

      await useAuthStore().setDisplayName(this.username);
      useLoadingStore().loading = false;
    },
    async changePassword() {
      useLoadingStore().loading = true;
      const authStore = useAuthStore();

      try {
        await authStore.reauthenticateWithPassword(this.currentPassword);
      } catch (error) {
        this.currentPassword = '';
        this.newPassword = '';

        if (error.code === 'auth/wrong-password') {
          this.changePasswordFormInvalidReason = Locales[useSettingsStore().getLanguage()]['wrong-password'];
        } else {
          this.changePasswordFormInvalidReason = `${Locales[useSettingsStore().getLanguage()]['unknown-error']}: ${error.code}`;
        }

        useLoadingStore().loading = false;
        return;
      }

      try {
        await authStore.changePassword(this.newPassword);
      } catch (error) {
        this.changePasswordFormInvalidReason = `${Locales[useSettingsStore().getLanguage()]['unknown-error']}: ${error.code}`;
        useLoadingStore().loading = false;

        return;
      }

      this.modalShow = false;
      this.newPassword = '';
      this.currentPassword = '';
      useLoadingStore().loading = false;
    },
    async signOut() {
      useLoadingStore().loading = true;

      await useAuthStore().logout();
      await this.$router.push('/login');
    },
    async chooseReminderAudio() {
      const result = await dialog.showOpenDialogSync({
        title: 'Choosing',
        buttonLabel: 'Choose',
        properties: ['openFile'],
        filters: [{ name: 'Audio Files', extensions: ['mp3', 'wav', 'ogg'] }],
      });

      if (!result) {
        return;
      }

      useSettingsStore().setReminderAudio(result[0]);
      this.audio.pause();
      this.audio = new Audio(result[0]);
      this.reminderAudioPath = result[0];
    },
    resetReminderAudio() {
      useSettingsStore().removeReminderAudio();
      this.audio.pause();
      this.audio = new Audio(Alarm);
      this.reminderAudioPath = this.Locales.default;
    },
  },
  beforeUnmount() {
    this.audio.pause();
    this.audio = null;
  },
};
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: 350px calc(100% - 350px);
  row-gap: 25px;
}

.param-name {
  display: flex;
  align-items: center;
}

.solo-button {
  width: 200px;
}

.param-input {
  width: calc(100% - 15px - 250px);
}

.param-button {
  width: 250px;
}

.right {
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
}
</style>
