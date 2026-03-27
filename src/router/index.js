import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import Login from '../pages/Login.vue';
import Feed from '../pages/Feed.vue';
import Users from '../pages/Users.vue';
import Profile from '../pages/Profile.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: Login },
    { path: '/feed', component: Feed, meta: { requiresAuth: true } },
    { path: '/users', component: Users, meta: { requiresAuth: true } },
    { path: '/profile/:id', component: Profile, meta: { requiresAuth: true } },
    { path: '/:pathMatch(.*)*', redirect: '/feed' }
  ]
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.currentUser) {
    next('/login');
  } else if (to.path === '/login' && authStore.currentUser) {
    next('/feed');
  } else {
    next();
  }
});

export default router;