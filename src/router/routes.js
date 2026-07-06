const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
  },
  {
    path: '/comece-aqui',
    component: () => import('layouts/DinamicLanding.vue'),
  },
  {
    path: '/landing-3d',
    name: 'landing-3d',
    component: () => import('pages/AitoLanding3DPage.vue'),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
