import { createRouter, createWebHistory } from 'vue-router'
import VueCookies from 'vue-cookies';

// Fungsi untuk memeriksa autentikasi
const requireAuth = (to, from, next) => {
  const tokenlogin = VueCookies.get('tokenlogin');
  if (!tokenlogin && to.path !== '/') {
    next('/');
  } else {
    next();
  }
};

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('../views/Login.vue'),
    meta: { title: 'Login Admin Sahabat CGI' }
  },

  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
    meta: { title: 'About' }
  },

  {
    path: '/donasi',
    name: 'donasi',
    component: () => import('../views/Donasi.vue'),
    meta: { title: 'Donasi' }
  },

  {
    path: '/berita',
    name: 'berita',
    component: () => import('../views/Informasicml.vue'),
    meta: { title: 'Informasi CML' }
  },
  {
    path: '/editadmin/:id',
    name: 'editadmin',
    component: () => import('../views/Editadmin.vue'),
    meta: { title: 'Edit Admin Sahabat CGI' }
  },
  {
    path: '/editberita/:id',
    name: 'editberita',
    component: () => import('../views/Editberita.vue'),
    meta: { title: 'Edit Berita' }
  },
  {
    path: '/editcerita/:id',
    name: 'editcerita',
    component: () => import('../views/EditCerita.vue'),
    meta: { title: 'Edit Cerita' }
  },
  {
    path: '/EditComment/:id',
    name: 'EditComment',
    component: () => import('../views/EditComment.vue'),
    meta: { title: 'Edit Komentar' }
  },
  {
    path: '/editkegiatan/:id',
    name: 'editkegiatan',
    component: () => import('../views/Editkegiatan.vue'),
    meta: { title: 'Edit Kegiatan' }
  },
  {
    path: '/editProfilKomunitas',
    name: 'editProfilKomunitas',
    component: () => import('../views/EditProfilKomunitas.vue'),
    meta: { title: 'Edit Profil Komunitas' }
  },
  {
    path: '/Editpengurus/:id',
    name: 'Editpengurus',
    component: () => import('../views/Editpengurus.vue'),
    meta: { title: 'Edit Pengurus' }
  },
  {
    path: '/editquotes/:id',
    name: 'editquotes',
    component: () => import('../views/Editquotes.vue'),
    meta: { title: 'Edit Quotes' }
  },
  {
    path: '/kelolaakun',
    name: 'kelolaakun',
    component: () => import('../views/Kelolaakun.vue'),
    meta: { title: 'Kelola Akun Admin Sahabat CGI' }
  },
  {
    path: '/kegiatan',
    name: 'kegiatan',
    component: () => import('../views/Kegiatan.vue'),
    meta: { title: 'Kegiatan' }
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
    meta: { title: 'Profil Komunitas Sahabat CGI' }
  },
  {
    path: '/Penguruskomunitas',
    name: 'Penguruskomunitas',
    component: () => import('../views/Penguruskomunitas.vue'),
    meta: { title: 'Pengurus Komunitas' }
  },
  {
    path: '/peraturancerita',
    name: 'peraturancerita',
    component: () => import('../views/Peraturancerita.vue'),
    meta: { title: 'Peraturan Cerita' }
  },
  {
    path: '/quotes',
    name: 'quotes',
    component: () => import('../views/Quotes.vue'),
    meta: { title: 'Quotes' }
  },
  {
    path: '/UserGuideCerita',
    name: 'UserGuideCerita',
    component: () => import('../views/UserGuideEditCerita.vue'),
    meta: { title: 'User Guide Cerita' }
  },
  {
    path: '/UserGuideQuote',
    name: 'UserGuideQuote',
    component: () => import('../views/UserGuideTambahQuote.vue'),
    meta: { title: 'User Guide Quote' }
  },
  {
    path: '/verifikasicerita',
    name: 'verifikasicerita',
    component: () => import('../views/Verifikasicerita.vue'),
    meta: { title: 'Verifikasi Cerita' }
  },
].map(route => ({ ...route, beforeEnter: requireAuth }));

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach(requireAuth); // Gunakan requireAuth secara global

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title}`;
  next();
});

export default router;
