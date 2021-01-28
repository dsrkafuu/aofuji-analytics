/* vue */
import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

/* deps */
import Cookie from 'js-cookie';

/* utils */
import { AUTH_COOKIE_KEY } from '@/utils/constants.js';

/* routes */
import { routes } from './routes.js';

/* fix */
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

const router = new Router({
  mode: 'history',
  base: process.env.SERVER_BASE_URL,
  routes,
});

/* guards */
router.beforeEach((to, from, next) => {
  // login check
  if (to.name !== 'Login' && !Cookie.get(AUTH_COOKIE_KEY)) {
    next({ name: 'Login' });
  }
  // default behavior
  else {
    next();
  }
});

export { router };
