<template>
  <div class="center">
    <form class="sticker" @submit.prevent="onSubmit" @invalid.capture="onInvalid">
      <h2>{{ Locales['registration'] }}</h2>
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
      <input
        type="text"
        v-model.trim="username"
        :class="{ invalid: usernameInvalid }"
        class="mt-20 input"
        minlength="3"
        :placeholder="Locales.username"
        required />
      <span v-if="invalidReason" class="text-light text-salmon-pink d-block mt-15">{{ invalidReason }}</span>
      <button type="submit" class="button sea-green mt-25">{{ Locales.register }}</button>
      <RouterLink to="/login"
        ><button type="submit" class="button mt-20">{{ Locales.login }}</button></RouterLink
      >
    </form>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth';
import { useLoadingStore } from '../stores/loading';
import { useSettingsStore } from '../stores/settings';
import Locales from '../locales/index.json';

export default {
  data() {
    return {
      Locales: Locales[useSettingsStore().getLanguage()],
      emailInvalid: false,
      passwordInvalid: false,
      usernameInvalid: false,
      invalidReason: '',
      email: '',
      password: '',
      username: '',
    };
  },
  methods: {
    async onSubmit() {
      useLoadingStore().loading = true;
      const authStore = useAuthStore();

      try {
        await authStore.register(this.email, this.password, this.username);
        await this.$router.push('/verification');
      } catch (error) {
        useLoadingStore().loading = false;

        if (error.code === 'auth/email-already-in-use') {
          this.invalidReason = 'Email already in use';
        } else {
          this.invalidReason = `Unknown error: ${error.code}`;
        }
      }
    },
    onInvalid(event) {
      if (event.srcElement.id === 'email') {
        this.emailInvalid = true;
      } else if (event.srcElement.id === 'password') {
        this.passwordInvalid = true;
      } else if (event.srcElement.id === 'username') {
        this.usernameInvalid = true;
      }
    },
    onInput(event) {
      if (event.target.id === 'email') {
        this.emailInvalid = false;
      } else if (event.target.id === 'password') {
        this.passwordInvalid = false;
      } else if (event.target.id === 'username') {
        this.usernameInvalid = false;
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

.center {
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
}

input {
  width: 100%;
}

.button {
  width: 100%;
}
</style>
