<template>
  <div class="center">
    <form class="sticker" @submit.prevent="onSubmit" @invalid.capture="onInvalid">
      <h2>{{ Locales['login-title'] }}</h2>
      <input
        @input="onInput"
        id="email"
        v-model.trim="email"
        :class="{ invalid: emailInvalid }"
        class="mt-25 input"
        type="email"
        :placeholder="Locales.email"
        required />
      <input
        @input="onInput"
        id="password"
        v-model="password"
        :class="{ invalid: passwordInvalid }"
        class="mt-20 input"
        type="password"
        :placeholder="Locales.password"
        minlength="6"
        required />
      <span v-if="invalidReason" class="text-light text-salmon-pink d-block mt-15">{{ invalidReason }}</span>
      <button type="submit" class="button sea-green mt-25">{{ Locales.login }}</button>
      <RouterLink to="/register"
        ><button type="submit" class="button mt-20">{{ Locales.register }}</button></RouterLink
      >
    </form>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth';
import { useLoadingStore } from '../stores/loading';
import { useSettingsStore } from '../stores/settings';
import Locales from '../locales/index.json';
const { ipcRenderer } = window.require('electron');

export default {
  data() {
    return {
      Locales: Locales[useSettingsStore().getLanguage()],
      emailInvalid: false,
      passwordInvalid: false,
      invalidReason: '',
      email: '',
      password: '',
    };
  },
  created() {
    ipcRenderer.send('show-or-restore');
  },
  methods: {
    async onSubmit() {
      useLoadingStore().loading = true;
      const authStore = useAuthStore();

      try {
        await authStore.login(this.email, this.password);
        await this.$router.push('/');
      } catch (error) {
        useLoadingStore().loading = false;
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
          this.invalidReason = this.Locales['invalid-email-or-password'];
        } else {
          this.invalidReason = `${this.Locales['unknown-error']}: ${error.code}`;
        }
      }
    },
    onInvalid(event) {
      if (event.srcElement.id === 'email') {
        this.emailInvalid = true;
      } else if (event.srcElement.id === 'password') {
        this.passwordInvalid = true;
      }
    },
    onInput(event) {
      if (event.target.id === 'email') {
        this.emailInvalid = false;
      } else if (event.target.id === 'password') {
        this.passwordInvalid = false;
      }
    },
  },
};
</script>

<style scoped>
.sticker {
  max-width: 400px;
  min-width: 400px;
  width: 50px;
  padding: 30px;
  cursor: default;
}

input {
  width: 100%;
}

.button {
  width: 100%;
}
</style>
