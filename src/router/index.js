import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: HomeView
    // },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },

    {
      path: '/donasi',
      name: 'donasi',
      // route level code-splitting
      // this generates a separate chunk (Donasi.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Donasi.vue')
    },

    {
      path: '/informasicml',
      name: 'informasicml',
      // route level code-splitting
      // this generates a separate chunk (Informasicml.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Informasicml.vue')
    },

    {
      path: '/',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (Login.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Login.vue')
    },
    {
      path: '/kelolaakun',
      name: 'kelolaakun',
      // route level code-splitting
      // this generates a separate chunk (Kelolaakun.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Kelolaakun.vue')
    },

    {
      path: '/komunitas',
      name: 'komunitas',
      // route level code-splitting
      // this generates a separate chunk (Komunitas.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Komunitas.vue')
    },

    {
      path: '/quotes',
      name: 'quotes',
      // route level code-splitting
      // this generates a separate chunk (Quotes.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Quotes.vue')
    },

    {
      path: '/verifikasicerita',
      name: 'verifikasicerita',
      // route level code-splitting
      // this generates a separate chunk (Verifikasicerita.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Verifikasicerita.vue')
    },
  ]
})

export default router
