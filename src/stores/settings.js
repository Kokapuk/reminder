import { defineStore } from 'pinia';
import Locales from '../locales/index.json';

const { ipcRenderer } = window.require('electron');

export const useSettingsStore = defineStore('settings', {
  actions: {
    getVolume() {
      return localStorage.getItem('volume') ? JSON.parse(localStorage.getItem('volume')) : 0.5;
    },
    setVolume(volume) {
      localStorage.setItem('volume', JSON.stringify(volume));
    },

    getUpcomingHidden() {
      localStorage.getItem('upcomingHidden') ? JSON.parse(localStorage.getItem('upcomingHidden')) : false;
    },
    setUpcomingHidden(hidden) {
      localStorage.setItem('upcomingHidden', JSON.stringify(hidden));
    },

    getRemindedHidden() {
      localStorage.getItem('remindedHidden') ? JSON.parse(localStorage.getItem('remindedHidden')) : false;
    },
    setRemindedHidden(hidden) {
      localStorage.setItem('remindedHidden', JSON.stringify(hidden));
    },

    getLanguage() {
      return localStorage.getItem('language') ? localStorage.getItem('language') : navigator.language in Locales ? navigator.language : 'en';
    },
    setLanguage(language) {
      localStorage.setItem('language', language);
    },

    getShowWindowOnReminder() {
      return localStorage.getItem('show-window-on-reminder') ? JSON.parse(localStorage.getItem('show-window-on-reminder')) : false;
    },
    setShowWindowOnReminder(show) {
      localStorage.setItem('show-window-on-reminder', show);
    },

    getStartMinimized() {
      return ipcRenderer.sendSync('get-option', 'startMinimized');
    },
    setStartMinimized(startMinimized) {
      return ipcRenderer.send('set-option', 'startMinimized', startMinimized);
    },

    getRemindeAudio() {
      return localStorage.getItem('reminder-audio') ? localStorage.getItem('reminder-audio') : null;
    },
    setReminderAudio(audioPath) {
      localStorage.setItem('reminder-audio', audioPath);
    },
    removeReminderAudio() {
      localStorage.removeItem('reminder-audio');
    },
  },
});
