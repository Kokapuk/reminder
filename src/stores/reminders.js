import { defineStore } from 'pinia';

export const useRemindersStore = defineStore('reminders', {
  state: () => {
    return { reminders: null, reminding: false };
  },
});
