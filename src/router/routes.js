export const routes = [
  {
    path: '/',
    name: 'Base',
    component: () => import(/* webpackChunkName: "chunk-base" */ '@/views/Base.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () =>
          import(/* webpackChunkName: "chunk-dashboard" */ '@/views/Dashboard/index.vue'),
      },
      {
        path: '/realtime',
        name: 'Realtime',
        component: () =>
          import(/* webpackChunkName: "chunk-realtime" */ '@/views/Realtime/index.vue'),
      },
      {
        path: '/settings',
        name: 'Settings',
        component: () =>
          import(/* webpackChunkName: "chunk-settings" */ '@/views/Settings/index.vue'),
      },
    ],
  },
  {
    path: '/share',
    name: 'Share',
    component: () => import(/* webpackChunkName: "chunk-share" */ '@/views/Share.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "chunk-edges" */ '@/views/Login.vue'),
  },
  {
    path: '/*',
    name: 'NotFound',
    component: () => import(/* webpackChunkName: "chunk-edges" */ '@/views/NotFound.vue'),
  },
];
