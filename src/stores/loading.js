import { defineStore } from 'pinia';

export const useLoadingStore = defineStore('loading', {
  state: () => {
    return { loading: false, connectionLost: true };
  },
});
