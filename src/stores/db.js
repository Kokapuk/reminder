import { defineStore } from 'pinia';
import { getDatabase, ref, set, get, child, update, remove, onValue, goOffline, goOnline } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { useRemindersStore } from './reminders';
import { useLoadingStore } from './loading';

export const useDbStore = defineStore('db', {
  actions: {
    async createReminder(reminder) {
      const uid = getAuth().currentUser.uid;
      const database = getDatabase();

      await set(ref(database, `reminders/${uid}/${reminder.id}`), reminder);
    },
    async getReminder(id) {
      const uid = getAuth().currentUser.uid;
      const database = getDatabase();
      const databaseRef = ref(database);
      const snapshot = await get(child(databaseRef, `reminders/${uid}/${id}`));

      if (!snapshot.exists()) {
        return null;
      }

      return snapshot.val();
    },
    async updateAllReminders() {
      const uid = getAuth().currentUser.uid;
      const database = getDatabase();
      const databaseRef = ref(database);
      const snapshot = await get(child(databaseRef, `reminders/${uid}`));

      if (!snapshot.exists()) {
        useRemindersStore().reminders = [];
      }

      let reminders = [];

      snapshot.forEach((childSnapshot) => {
        reminders.push(childSnapshot.val());
      });

      useRemindersStore().reminders = reminders;
    },
    async watchAllReminders() {
      const uid = getAuth().currentUser.uid;
      const database = getDatabase();
      const databaseRef = ref(database, `reminders/${uid}`);
      let firstRun = true;

      await this.updateAllReminders();

      onValue(databaseRef, (snapshot) => {
        let reminders = [];

        snapshot.forEach((childSnapshot) => {
          reminders.push(childSnapshot.val());
        });

        if (firstRun) {
          firstRun = false;
        } else {
          useRemindersStore().reminders = reminders;
        }
      });
    },
    async updateReminder(reminder) {
      const uid = getAuth().currentUser.uid;
      const database = getDatabase();
      const updates = {};

      updates[`reminders/${uid}/${reminder.id}`] = reminder;

      await update(ref(database), updates);
    },
    async deleteReminder(id) {
      const uid = getAuth().currentUser.uid;
      const database = getDatabase();

      await remove(ref(database, `reminders/${uid}/${id}`));
    },
    async watchConnection() {
      const database = getDatabase();
      const connectedRef = ref(database, '.info/connected');
      let timeout;

      onValue(connectedRef, (snapshot) => {
        if (snapshot.val() === false) {
          timeout = setTimeout(() => {
            useLoadingStore().connectionLost = true;
          }, 5000);
        } else {
          clearTimeout(timeout);
          useLoadingStore().connectionLost = false;
        }
      });
    },
  },
});
