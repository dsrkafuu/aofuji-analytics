/* components */
import Base from '../views/Base/index.vue';
import Login from '../views/Login.vue';
import NotFound from '../views/NotFound.vue';
import Realtime from '../views/Realtime/Realtime.vue';
import Dashboard from '../views/Dashboard/Dashboard.vue';
import Settings from '../views/Settings/index.vue';

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
        component: Realtime,
      },
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
      },

      {
        path: '/settings',
        name: 'Settings',
        component: Settings,
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
