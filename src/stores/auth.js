import { defineStore } from 'pinia';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendEmailVerification,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from 'firebase/auth';

export const useAuthStore = defineStore('auth', {
  actions: {
    async login(email, password) {
      const auth = getAuth();

      const user = await signInWithEmailAndPassword(auth, email, password);
      return user;
    },
    async register(email, password, username) {
      const auth = getAuth();

      const user = await createUserWithEmailAndPassword(auth, email, password);
      const authStore = useAuthStore();
      await authStore.logout();
      await updateProfile(user.user, { displayName: username });
      await authStore.login(email, password);

      return user;
    },
    async logout() {
      const auth = getAuth();
      await signOut(auth);
    },
    async verifyEmail() {
      const auth = getAuth();
      await sendEmailVerification(auth.currentUser);
    },
    getCurrentUser() {
      const auth = getAuth();

      return auth.currentUser;
    },
    async setDisplayName(displayName) {
      const auth = getAuth();

      await updateProfile(auth.currentUser, { displayName });
    },
    async reauthenticateWithPassword(providedPassword) {
      const auth = getAuth();
      const providedCredential = EmailAuthProvider.credential(auth.currentUser.email, providedPassword);

      await reauthenticateWithCredential(auth.currentUser, providedCredential);
    },
    async changePassword(newPassword) {
      const auth = getAuth();

      await updatePassword(auth.currentUser, newPassword);
    },
  },
});
