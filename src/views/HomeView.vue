<template>
  <div class="h-100">
    <div v-if="!useLoadingStore().loading && useRemindersStore().reminders" class="h-100">
      <ReminderList :reminders="useRemindersStore().reminders" />
      <button class="circle-button" :class="useThemeColorStore().themeColor" @click="() => create()">
        <Plus />
      </button>
    </div>
  </div>
</template>

<script>
import Plus from '../assets/icons/plus.svg';
import ReminderList from '../components/ReminderList.vue';
import { useThemeColorStore } from '../stores/theme-color';
import { useDbStore } from '../stores/db';
import { useLoadingStore } from '../stores/loading';
import { useRemindersStore } from '../stores/reminders';

export default {
  components: { ReminderList, Plus },
  methods: {
    useThemeColorStore,
    useRemindersStore,
    useLoadingStore,
    async create() {
      useLoadingStore().loading = true;

      var reminder = { color: useThemeColorStore().getRandomThemeColor(), title: '', text: '', date: 0, reminded: false, id: Date.now() };

      const dbStore = useDbStore();
      await dbStore.createReminder(reminder);

      await this.$router.push(`/edit/${reminder.id}`);
    },
    async filter() {
      const dbStore = useDbStore();

      for (let i = 0; i < useRemindersStore().reminders.length; i++) {
        const reminder = useRemindersStore().reminders[i];

        if (reminder.title === '' && reminder.text === '') {
          await dbStore.deleteReminder(reminder.id);
        }
      }

      await dbStore.updateAllReminders();
    },
  },
  async created() {
    useLoadingStore().loading = true;

    if (useRemindersStore().reminders) {
      await this.filter();
      useLoadingStore().loading = false;

      return;
    }

    await useDbStore().watchAllReminders();
    await this.filter();
    useLoadingStore().loading = false;
  },
};
</script>

<style scoped>
.circle-button {
  position: fixed;
  right: 50px;
  bottom: 50px;
  border-radius: 50%;
  height: 50px;
  width: 50px;
  box-shadow: var(--shadow-big);
  background-color: rgb(var(--background-color));
  font-size: 25px;
  cursor: pointer;
  transition: var(--transition);
}

.circle-button:active {
  box-shadow: var(--shadow-small);
}

.circle-button.yellow {
  color: rgb(var(--yellow));
}

.circle-button:hover.yellow {
  background-color: rgb(var(--yellow));
  color: rgb(var(--background-color));
}

.circle-button.orange {
  color: rgb(var(--orange));
}

.circle-button:hover.orange {
  background-color: rgb(var(--orange));
  color: rgb(var(--background-color));
}

.circle-button.sky-blue {
  color: rgb(var(--sky-blue));
}

.circle-button:hover.sky-blue {
  background-color: rgb(var(--sky-blue));
  color: rgb(var(--background-color));
}

.circle-button.sea-green {
  color: rgb(var(--sea-green));
}

.circle-button:hover.sea-green {
  background-color: rgb(var(--sea-green));
  color: rgb(var(--background-color));
}

.circle-button.pink {
  color: rgb(var(--pink));
}

.circle-button:hover.pink {
  background-color: rgb(var(--pink));
  color: rgb(var(--background-color));
}

.circle-button.salmon-pink {
  color: rgb(var(--salmon-pink));
}

.circle-button:hover.salmon-pink {
  background-color: rgb(var(--salmon-pink));
  color: rgb(var(--background-color));
}
</style>
