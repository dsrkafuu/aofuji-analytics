import Base from '@/views/Base/index.vue';

export const routes = [
  {
    path: '/',
    name: 'Base',
    component: Base,
    redirect: '/realtime',
    children: [
      {
        path: '/realtime',
        name: 'Realtime',
        component: () =>
          import(/* webpackChunkName: "chunk-realtime" */ '@/views/Realtime/index.vue'),
      },
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () =>
          import(/* webpackChunkName: "chunk-dashboard" */ '@/views/Dashboard/index.vue'),
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
