import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);
import Cookie from 'js-cookie';

// only throw error when NavigationFailure
// https://github.com/vuejs/vue-router/issues/2881#issuecomment-520554378
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalPush.call(this, location, onResolve, onReject);
  }
  return originalPush.call(this, location).catch((err) => {
    if (Router.isNavigationFailure(err)) {
      return err; // resolve err
    }
    return Promise.reject(err); // rethrow error
  });
};

import { COOKIE_TOKEN } from '@/utils/constants';
import { routes } from './routes';

const router = new Router({
  mode: 'history',
  base: process.env.VUE_APP_BASE_URL,
  routes,
});

/* guards */
router.beforeEach((to, from, next) => {
  // if going to share page and has share query
  if (to.name === 'Share' && to.query.id) {
    next();
  }
  // login check, only when not going to login/404
  else if (to.name !== 'NotFound' && to.name !== 'Login' && !Cookie.get(COOKIE_TOKEN)) {
    next({ name: 'Login' });
  }
  // default behavior
  else {
    next();
  }
});

export default router;
