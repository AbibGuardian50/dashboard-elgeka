import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: HomeView
    // },

    // beforeEach((to, from, next) => {
    //   if (to.matched.some(record => record.meta.requiresAuth)) {
    //     const tokenlogin = sessionStorage.getItem('tokenlogin');

    //     if (!tokenlogin) {
    //       next('/');
    //     }
    //     else {
    //       next()
    //     }
    //   }
    // }),


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
      component: () => import('../views/Donasi.vue'),
      beforeEnter: (to, from, next) => {
        const tokenlogin = sessionStorage.getItem('tokenlogin');
        if (!tokenlogin) {
          next('/')
        } else {
          next()
        }
      }
    },

    {
      path: '/informasicml',
      name: 'informasicml',
      // route level code-splitting
      // this generates a separate chunk (Informasicml.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Informasicml.vue'),
      beforeEnter: (to, from, next) => {
        const tokenlogin = sessionStorage.getItem('tokenlogin');
        if (!tokenlogin) {
          next('/')
        } else {
          next()
        }
      }
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
      component: () => import('../views/Kelolaakun.vue'),
      beforeEnter: (to, from, next) => {
        const tokenlogin = sessionStorage.getItem('tokenlogin');
        if (!tokenlogin) {
          next('/')
        } else {
          next()
        }
      }
      
    },

    {
      path: '/komunitas',
      name: 'komunitas',
      // route level code-splitting
      // this generates a separate chunk (Komunitas.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Komunitas.vue'),
      beforeEnter: (to, from, next) => {
        const tokenlogin = sessionStorage.getItem('tokenlogin');
        if (!tokenlogin) {
          next('/')
        } else {
          next()
        }
      }
    },

    {
      path: '/profilkomunitas',
      name: 'profilkomunitas',
      // route level code-splitting
      // this generates a separate chunk (Komunitas.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Profilkomunitas.vue'),
      beforeEnter: (to, from, next) => {
        const tokenlogin = sessionStorage.getItem('tokenlogin');
        if (!tokenlogin) {
          next('/')
        } else {
          next()
        }
      }
    },

    {
      path: '/quotes',
      name: 'quotes',
      // route level code-splitting
      // this generates a separate chunk (Quotes.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Quotes.vue'),
      beforeEnter: (to, from, next) => {
        const tokenlogin = sessionStorage.getItem('tokenlogin');
        if (!tokenlogin) {
          next('/')
        } else {
          next()
        }
      }
    },

    {
      path: '/verifikasicerita',
      name: 'verifikasicerita',
      // route level code-splitting
      // this generates a separate chunk (Verifikasicerita.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Verifikasicerita.vue'),
      beforeEnter: (to, from, next) => {
        const tokenlogin = sessionStorage.getItem('tokenlogin');
        if (!tokenlogin) {
          next('/')
        } else {
          next()
        }
      }


    },
  ]
})

export default router
