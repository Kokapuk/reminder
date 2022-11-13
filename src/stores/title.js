import { defineStore } from 'pinia';

export const useTitleStore = defineStore('title', {
  state: () => {
    return { title: '' };
  },
});
