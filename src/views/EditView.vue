<template>
  <div v-if="reminder" class="h-100">
    <input :placeholder="Locales[useSettingsStore().getLanguage()].title" type="small" class="edit title w-100" v-model.trim="reminder.title" />
    <textarea :placeholder="Locales[useSettingsStore().getLanguage()].text" class="edit small mt-15 w-100" v-model.trim="reminder.text" />
    <div class="mt-15 form edit">
      <input type="text" class="small framework" readonly :value="useDateStore().dateToFullString(reminder.date)" />
      <input
        @input="dateTimePicked"
        class="picker"
        ref="dateTimePicker"
        type="datetime-local"
        :min="toLocaleISOString(Date.now())"
        :value="reminder.date === 0 ? toLocaleISOString(Date.now()) : toLocaleISOString(reminder.date)" />
      <button @click="dateTimePick" class="icon-button">
        <calendar class="icon" />
      </button>
    </div>
    <div class="mt-15 center-y">
      <label :class="{ checked: reminder.color === 'yellow' }" class="radio-container yellow">
        <input v-model="reminder.color" type="radio" name="color" value="yellow" class="color-picker" />
        <check class="checkmark" />
      </label>
      <label :class="{ checked: reminder.color === 'orange' }" class="radio-container orange">
        <input v-model="reminder.color" type="radio" name="color" value="orange" class="color-picker" />
        <check class="checkmark" />
      </label>
      <label :class="{ checked: reminder.color === 'sky-blue' }" class="radio-container sky-blue">
        <input v-model="reminder.color" type="radio" name="color" value="sky-blue" class="color-picker" />
        <check class="checkmark" />
      </label>
      <label :class="{ checked: reminder.color === 'sea-green' }" class="radio-container sea-green">
        <input v-model="reminder.color" type="radio" name="color" value="sea-green" class="color-picker" />
        <check class="checkmark" />
      </label>
      <label :class="{ checked: reminder.color === 'pink' }" class="radio-container pink">
        <input v-model="reminder.color" type="radio" name="color" value="pink" class="color-picker" />
        <check class="checkmark" />
      </label>
      <label :class="{ checked: reminder.color === 'salmon-pink' }" class="radio-container salmon-pink">
        <input v-model="reminder.color" type="radio" name="color" value="salmon-pink" class="color-picker" />
        <check class="checkmark" />
      </label>
    </div>
    <div class="mt-15 right">
      <button @click="() => deleteReminder()" class="button salmon-pink">{{ Locales[useSettingsStore().getLanguage()]['delete'] }}</button>
      <button @click="() => leave()" class="button transparent ms-10">{{ Locales[useSettingsStore().getLanguage()]['cancel'] }}</button>
      <button @click="() => saveReminder(false)" class="button orange ms-10" :disabled="!canSave">
        {{ Locales[useSettingsStore().getLanguage()]['save-dont-remind'] }}
      </button>
      <button @click="() => saveReminder(true)" class="button sea-green ms-10" :disabled="!canSave">
        {{ Locales[useSettingsStore().getLanguage()]['save-remind'] }}
      </button>
    </div>
  </div>
</template>

<script>
import Calendar from '../assets/icons/calendar.svg';
import Check from '../assets/icons/check.svg';
import { useTitleStore } from '../stores/title';
import { useRemindersStore } from '../stores/reminders';
import { useThemeColorStore } from '../stores/theme-color';
import { useDbStore } from '../stores/db';
import { useLoadingStore } from '../stores/loading';
import { useDateStore } from '../stores/date';
import { useSettingsStore } from '../stores/settings';
import Locales from '../locales/index.json';

export default {
  components: { Calendar, Check },
  data() {
    return {
      reminder: null,
      canSave: false,
      Locales,
    };
  },
  created() {
    this.fetchReminder();
    window.onkeydown = (event) => {
      if (useLoadingStore().loading) {
        return;
      }

      if (event.key === 'Escape') {
        this.leave();
      }
    };
  },
  watch: {
    'reminder.title': function (newVal) {
      this.updateTitle(newVal);
      this.updateCanSave();
    },
    'reminder.text': function () {
      this.updateCanSave();
    },
    'reminder.date': function () {
      this.updateCanSave();
    },
    'reminder.color': function (newVal) {
      useThemeColorStore().themeColor = newVal;
    },
  },
  methods: {
    useDateStore,
    useSettingsStore,
    fetchReminder() {
      this.reminder = { ...useRemindersStore().reminders.find((item) => item.id == this.$route.params.id) };

      useRemindersStore().reminding = true;
      this.updateTitle(this.reminder.title);
      useThemeColorStore().themeColor = this.reminder.color;
      this.canSave = this.reminder.title !== '' || this.reminder.text;
    },
    toLocaleISOString(date) {
      date = new Date(date);

      return `${date.toLocaleDateString().split('.')[2]}-${date.toLocaleDateString().split('.')[1]}-${
        date.toLocaleDateString().split('.')[0]
      }T${useDateStore().dateToTimeString(date)}`;
    },
    updateTitle(newTitle) {
      useTitleStore().title = newTitle === '' ? Locales[useSettingsStore().getLanguage()].editing : newTitle;
    },
    dateTimePick() {
      this.$refs.dateTimePicker.showPicker();
    },
    dateTimePicked(event) {
      this.reminder.date = new Date(Date.parse(event.target.value)).getTime();
    },
    updateCanSave() {
      if ((this.reminder.title || this.reminder.text) && this.reminder.date > Date.now()) {
        this.canSave = true;
        return;
      }

      this.canSave = false;
    },
    async leave() {
      useRemindersStore().reminding = false;
      useLoadingStore().loading = false;
      await this.$router.push('/');
    },
    async saveReminder(remind) {
      useLoadingStore().loading = true;
      const dbStore = useDbStore();
      this.reminder.reminded = !remind;
      await dbStore.updateReminder(this.reminder);
      this.leave();
    },
    async deleteReminder() {
      useLoadingStore().loading = true;
      const dbStore = useDbStore();
      await dbStore.deleteReminder(this.reminder.id);
      this.leave();
    },
  },
};
</script>

<style scoped>
.edit {
  padding: 0 10px 0 10px;
}

.w-100 {
  min-width: 100%;
  max-width: 100%;
  display: block;
}

.title {
  font-size: 19px;
  font-weight: bolder;
}

.small {
  font-size: 15px;
  resize: none;
  height: calc(100% - 40px - 35px - 39px - 23px - 60px);
}

.framework {
  background-color: transparent;
}

.form {
  padding-top: 10px;
  padding-bottom: 10px;
  border-radius: var(--small-border-radius);
  background-color: rgb(var(--light-gray));
}

.right {
  display: flex;
  justify-content: end;
}

.icon-button {
  background-color: transparent;
  float: right;
  font-size: 19px;
  cursor: pointer;
  margin-left: 10px;
}

.icon {
  scale: 1.25;
  fill: rgb(var(--font-color));
}

.picker {
  float: right;
  width: 0;
  height: 0;
  overflow: hidden;
}

.radio-container {
  width: 35px;
  height: 35px;
  display: inline-block;
  margin-right: 5px;
  position: relative;
  cursor: pointer;
  border-radius: var(--small-border-radius);
  box-shadow: var(--shadow-small);
  transition: var(--transition);
}

.radio-container.checked {
  box-shadow: var(--shadow-none);
}

.color-picker {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  fill: rgb(var(--font-color));
  position: absolute;
  top: 9.5px;
  left: 9.5px;
  scale: 1.5;
  opacity: 0;
  transition: var(--transition);
}

.color-picker:checked + .checkmark {
  opacity: 1;
  scale: 2;
}
</style>
