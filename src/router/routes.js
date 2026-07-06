const routes = [
  {
    path: '/',
    name: 'landing-3d',
    component: () => import('pages/AitoLanding3DPage.vue'),
  },
  {
    path: '/sobre',
    component: () => import('layouts/MainLayout.vue'),
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
