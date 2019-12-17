import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'abstract',
  routes: [
    {
      path: '/day',
      name: 'day',
      component: () => import(/* webpackChunkName: 'calendar' */'@/screen/Day.vue')
    },
    {
      path: '/week',
      name: 'week',
      component: () => import(/* webpackChunkName: 'calendar' */'@/screen/Week.vue')
    },
    {
      path: '/month',
      name: 'month',
      component: () => import(/* webpackChunkName: 'calendar' */'@/screen/Month.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: 'calendar' */'@/screen/Login.vue')
    },
    {
      path: '/detail',
      name: 'detail',
      props: true,
      component: () => import(/* webpackChunkName: 'calendar' */'@/screen/Detail.vue')
    }
  ]
})
