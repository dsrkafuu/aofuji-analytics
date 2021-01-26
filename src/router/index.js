/* vue */
import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

/* components */
import Base from '../views/Base/index.vue';
import Login from '../views/Login.vue';
import NotFound from '../views/NotFound.vue';
import Realtime from '../views/Realtime/Realtime.vue';
import Dashboard from '../views/Dashboard/Dashboard.vue';
import Settings from '../views/Settings/index.vue';

const routes = [
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

// only throw error when NavigationFailure
// https://github.com/vuejs/vue-router/issues/2881#issuecomment-520554378
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch((err) => {
    if (Router.isNavigationFailure(err)) {
      // resolve err
      return err;
    }
    // rethrow error
    return Promise.reject(err);
  });
};

export default new Router({
  mode: 'history',
  base: process.env.SERVER_BASE_URL,
  routes,
});
