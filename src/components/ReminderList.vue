<template>
  <div v-if="useRemindersStore().reminders.length > 0">
    <div class="category-container" v-if="upcoming.length > 0">
      <span
        @click="
          () => {
            upcomingHidden = !upcomingHidden;
          }
        "
        class="text-gray category"
        >{{ Locales[useSettingsStore().getLanguage()].upcoming }} <Caret class="caret" :class="{ hidden: upcomingHidden }"
      /></span>
      <div class="grid mt-15" :class="{ hidden: upcomingHidden }">
        <reminder v-for="reminder in upcoming" :reminder="reminder" :key="reminder.id" />
      </div>
    </div>
    <div class="category-container" v-if="reminded.length > 0">
      <span
        @click="
          () => {
            remindedHidden = !remindedHidden;
          }
        "
        class="text-gray category"
        >{{ Locales[useSettingsStore().getLanguage()].reminded }} <Caret class="caret" :class="{ hidden: remindedHidden }"
      /></span>
      <div class="grid mt-15" :class="{ hidden: remindedHidden }">
        <reminder v-for="reminder in reminded" :reminder="reminder" :key="reminder.id" />
      </div>
    </div>
  </div>
  <span v-else class="text-gray text-light text-center center"
    >{{ Locales[useSettingsStore().getLanguage()]['no-reminders'] }}
    <br />
    {{ Locales[useSettingsStore().getLanguage()]['press-+'] }}
  </span>
</template>

<script>
import Caret from '../assets/icons/caret-up.svg';
import Reminder from './Reminder.vue';
import Locales from '../locales/index.json';
import { useRemindersStore } from '../stores/reminders';
import { useSettingsStore } from '../stores/settings';

export default {
  data() {
    return {
      Locales,
      upcoming: [],
      reminded: [],
      upcomingHidden: useSettingsStore().getUpcomingHidden(),
      remindedHidden: useSettingsStore().getRemindedHidden(),
    };
  },
  components: {
    Reminder,
    Caret,
  },
  methods: {
    useRemindersStore,
    useSettingsStore,
    sortReminders() {
      useRemindersStore().reminders.sort((a, b) => {
        return a.date - b.date;
      });

      useRemindersStore().reminders.sort((a, b) => {
        if (a.reminded === b.reminded) {
          return 0;
        }

        if (a.reminded && !b.reminded) {
          return 1;
        }

        if (!a.reminded && b.reminded) {
          return -1;
        }
      });

      useRemindersStore().reminders.map((reminder) => {
        reminder.reminded ? this.reminded.push(reminder) : this.upcoming.push(reminder);
      });
    },
  },
  created() {
    this.sortReminders();
  },
  watch: {
    upcomingHidden(newVal) {
      useSettingsStore().setUpcomingHidden(newVal);
    },
    remindedHidden(newVal) {
      useSettingsStore().setRemindedHidden(newVal);
    },
  },
};
</script>

<style scoped>
/* .grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, 250px);
  gap: 15px;
  align-items: flex-start;
  justify-content: center;
  overflow: hidden;
  padding-bottom: 25px;
} */

.sticker {
  margin-bottom: 15px;
  break-inside: avoid;
}

.grid {
  overflow: hidden;
  columns: 250px;
  column-gap: 10px;
  padding: 0px 25px 25px 25px;
}


.grid.hidden {
  padding: 0px;
  height: 0;
}

.category {
  cursor: pointer;
}

.caret {
  transition: var(--transition);
}

.caret.hidden {
  rotate: 180deg;
}
</style>
