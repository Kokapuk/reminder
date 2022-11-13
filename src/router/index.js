import { getAuth } from 'firebase/auth';
import { createRouter, createWebHashHistory } from 'vue-router';
import { useTitleStore } from '../stores/title';
import { useLoadingStore } from '../stores/loading';
import { useSettingsStore } from '../stores/settings';
import Locales from '../locales/index.json';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/login',
      name: 'login-title',
      meta: {
        hideForAuth: true,
        transition: 'scale-down',
      },
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'registration',
      meta: {
        hideForAuth: true,
        transition: 'scale-down',
      },
      component: () => import('../views/RegisterView.vue'),
    },
    {
      path: '/verification',
      name: 'verification',
      meta: {
        transition: 'scale-up',
      },
      component: () => import('../views/VerificationRequirementView.vue'),
    },
    {
      path: '/',
      name: 'reminders',
      meta: {
        requiresAuth: true,
        transition: 'scale-down',
      },
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/edit/:id',
      name: 'editing',
      meta: {
        requiresAuth: true,
        transition: 'scale-up',
      },
      component: () => import('../views/EditView.vue'),
    },
    {
      path: '/reminder/:id',
      name: 'reminder',
      meta: {
        requiresAuth: true,
        transition: 'scale-up',
      },
      component: () => import('../views/ReminderView.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      meta: {
        requiresAuth: true,
        transition: 'scale-up',
      },
      component: () => import('../views/SettingsView.vue'),
    },
  ],
});

router.afterEach((to, from) => {
  document.title = Locales[useSettingsStore().getLanguage()][to.name];
  useTitleStore().title = document.title;
});

router.beforeEach((to, from, next) => {
  useLoadingStore().loading = false;
  const user = getAuth().currentUser;

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!user) {
      next({ path: '/login' });
      return;
    }

    if (!user.emailVerified) {
      next({ path: '/verification' });
      return;
    }

    next();
    return;
  } else if (to.matched.some((record) => record.meta.hideForAuth)) {
    if (user) {
      if (!user.emailVerified) {
        next({ path: '/verification' });
        return;
      }

      next({ path: '/' });
      return;
    }

    next();
    return;
  }

  next();
});

export default router;
