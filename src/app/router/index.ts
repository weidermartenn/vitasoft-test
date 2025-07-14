/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
import HomePage from '@/pages/home/ui/index.vue'
import LoginPage from '@/pages/login/ui/index.vue'
import { useAuthStore } from '@/pages/login/model/store'
import { AuthorPage } from '@/pages/author'
import { PostPage } from '@/pages/post'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
      meta: { requiresAuth: true }
    },
    { 
      path: '/login',
      name: 'login',
      component: LoginPage,
      meta: { requiresAuth: false }                 
    },
    {
      path: '/author/:id',
      name: 'author',
      component: AuthorPage,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/post/:id',
      name: 'post',
      component: PostPage,
      props: true,
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, _, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated()) {
    next('/login')
  } else {
    next()
  }
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (localStorage.getItem('vuetify:dynamic-reload')) {
      console.error('Dynamic import error, reloading page did not fix it', err)
    } else {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
