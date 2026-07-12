const routes = [
  {
    path: '/',
    name: 'landing-3d',
    component: () => import('pages/AitoLanding3DPage.vue'),
  },
  {
    path: '/surpresa',
    name: 'dance-surprise',
    component: () => import('pages/AitoDancePage.vue'),
  },
  {
    path: '/app',
    name: 'user-app',
    component: () => import('pages/UserHomePage.vue'),
  },
  {
    path: '/admin/login',
    name: 'admin-login',
    component: () => import('pages/AdminLoginPage.vue'),
  },
  {
    path: '/admin',
    name: 'admin-panel',
    component: () => import('pages/AdminPanelPage.vue'),
  },
  {
    path: '/vendedor/login',
    name: 'seller-login',
    component: () => import('pages/SellerLoginPage.vue'),
  },
  {
    path: '/vendedor',
    name: 'seller-chat',
    component: () => import('pages/SellerChatPage.vue'),
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
