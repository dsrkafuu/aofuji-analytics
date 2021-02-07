import Base from '@/views/Base/index.vue';
import Login from '@/views/Login.vue';
import NotFound from '@/views/NotFound.vue';

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
        component: () => import(/* webpackChunkName: "realtime" */ '@/views/Realtime/index.vue'),
      },
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import(/* webpackChunkName: "dashboard" */ '@/views/Dashboard/index.vue'),
      },
      {
        path: '/settings',
        name: 'Settings',
        component: () => import(/* webpackChunkName: "settings" */ '@/views/Settings/index.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/*',
    name: 'NotFound',
    component: NotFound,
  },
];
