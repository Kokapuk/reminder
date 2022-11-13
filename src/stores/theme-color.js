import { defineStore } from 'pinia';

export const useThemeColorStore = defineStore('themeColor', {
  state: () => {
    return { themeColor: 'orange', colors: ['yellow', 'orange', 'sky-blue', 'sea-green', 'pink', 'salmon-pink'] };
  },
  actions: {
    getRandomThemeColor() {
      const colorId = Math.floor(Math.random() * this.colors.length);
      return this.colors[colorId];
    },
  },
});
