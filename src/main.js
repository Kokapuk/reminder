import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import './assets/main.css';

initializeApp({
  apiKey: 'AIzaSyArpvBOPL9wwVPjZItAHDZ7IEONsZjYXk4',
  authDomain: 'reminder-17ed4.firebaseapp.com',
  databaseURL: 'https://reminder-17ed4-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'reminder-17ed4',
  storageBucket: 'reminder-17ed4.appspot.com',
  messagingSenderId: '474283911666',
  appId: '1:474283911666:web:695a38956bfad4b59ea36b',
  measurementId: 'G-D3PWSZNFPP',
});

let app;

getAuth().onAuthStateChanged(() => {
  if (app) {
    return;
  }

  app = createApp(App);

  app.use(createPinia());
  app.use(router);

  app.mount('#app');
});
