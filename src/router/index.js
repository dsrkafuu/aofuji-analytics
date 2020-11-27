/* vue */
import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'goose',
    component: () => import(/* webpackChunkName: "goose" */ '../views/Goose.vue'),
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import(/* webpackChunkName: "goose" */ '../views/app/Dashboard.vue'),
      },
      {
        path: '/realtime',
        name: 'realtime',
        component: () => import(/* webpackChunkName: "goose" */ '../views/app/Realtime.vue'),
      },
      {
        path: '/settings',
        name: 'settings',
        component: () => import(/* webpackChunkName: "goose" */ '../views/app/Settings.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.SERVER_BASE_URL,
  routes,
});

export default router;
