import { createRouter, createWebHistory } from 'vue-router'
import VueCookies from 'vue-cookies';

// Fungsi untuk memeriksa autentikasi
const requireAuth = (to, from, next) => {
  const tokenlogin = VueCookies.get('tokenlogin');
  if (!tokenlogin) {
    next('/');
  } else {
    next();
  }
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/donasi',
      name: 'donasi',
      component: () => import('../views/Donasi.vue'),
      beforeEnter: requireAuth
    },
    {
      path: '/berita',
      name: 'berita',
      component: () => import('../views/Informasicml.vue'),
      beforeEnter: requireAuth
    },
    {
      path: '/editadmin/:id',
      name: 'editadmin',
      component: () => import('../views/Editadmin.vue'),
      beforeEnter: requireAuth
    },
    {
      path: '/editberita/:id',
      name: 'editberita',
      component: () => import('../views/Editberita.vue'),
      beforeEnter: requireAuth
    },
    {
      path: '/editcerita/:id',
      name: 'editcerita',
      component: () => import('../views/EditCerita.vue'),
      beforeEnter: requireAuth
    },
    {
      path: '/editkegiatan/:id',
      name: 'editkegiatan',
      component: () => import('../views/Editkegiatan.vue'),
      beforeEnter: requireAuth
    },
    {
      path: '/editprofiladmin',
      name: 'editprofiladmin',
      component: () => import('../views/EditProfilAdmin.vue'),
      beforeEnter: requireAuth
    },
    {
      path: '/editProfilKomunitas',
      name: 'editProfilKomunitas',
      component: () => import('../views/EditProfilKomunitas.vue'),
      beforeEnter: requireAuth
    },
    {
      path: '/Editpengurus/:id',
      name: 'Editpengurus',
      component: () => import('../views/Editpengurus.vue'),
      beforeEnter: requireAuth
    },
    {
      path: '/editquotes/:id',
      name: 'editquotes',
      component: () => import('../views/Editquotes.vue'),
      beforeEnter: requireAuth
    },
    {
      path: '/kelolaakun',
      name: 'kelolaakun',
      component: () => import('../views/Kelolaakun.vue'),
      beforeEnter: requireAuth
    },
    {
      path: '/komunitas',
      name: 'komunitas',
      component: () => import('../views/Komunitas.vue'),
      beforeEnter: requireAuth
    },
    {
      path: '/kegiatan',
      name: 'kegiatan',
      component: () => import('../views/Kegiatan.vue'),
      beforeEnter: requireAuth
    },
    {
      path: '/notfound',
      name: 'notfound',
      component: () => import('../views/Notfound.vue')
    },
    {
      path: '/profilkomunitas',
      name: 'profilkomunitas',
      component: () => import('../views/Profilkomunitas.vue'),
      beforeEnter: requireAuth
    },
    {
      path: '/Penguruskomunitas',
      name: 'Penguruskomunitas',
      component: () => import('../views/Penguruskomunitas.vue'),
      beforeEnter: requireAuth
    },
    {
      path: '/peraturancerita',
      name: 'peraturancerita',
      component: () => import('../views/Peraturancerita.vue'),
      beforeEnter: requireAuth
    },
    {
      path: '/quotes',
      name: 'quotes',
      component: () => import('../views/Quotes.vue'),
      beforeEnter: requireAuth
    },
    {
      path: '/verifikasicerita',
      name: 'verifikasicerita',
      component: () => import('../views/Verifikasicerita.vue'),
      beforeEnter: requireAuth
    },
  ]
})

export default router
