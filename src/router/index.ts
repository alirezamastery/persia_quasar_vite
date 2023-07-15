import {route} from 'quasar/wrappers'
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router'
import {Router} from 'vue-router'

import routesObj from './routes'
import useUserStore from 'stores/user'
import useGeneralStore from 'stores/general'


export let routerInstance: Router

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const router = createRouter({
    scrollBehavior: () => ({left: 0, top: 0}),
    routes: Object.values(routesObj),

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  router.beforeEach((to, from, next) => {
    const userStore = useUserStore()
    const needsAuthentication = to.matched.some((record) => record.meta['requiresAuth'])
    const isAuthenticated = userStore.isAuthenticated
    if (needsAuthentication) {
      if (!isAuthenticated && to.name !== 'Login') {
        userStore.logout() // Logout will push to Login
        // next({name: 'Login'})
      } else {
        next()
      }
    } else {
      next()
    }
  })

  router.beforeEach((to, from, next) => {
    const userStore = useUserStore()
    const guestRoute = to.matched.some((record) => record.meta['guest'])
    const isAuthenticated = userStore.isAuthenticated
    if (guestRoute) {
      if (isAuthenticated)
        next({name: 'Home'})
      else
        next()
    } else {
      next()
    }
  })

  router.beforeEach((to, from, next) => {
    const generalStore = useGeneralStore()
    generalStore.clearHttpRequestQueue()
    generalStore.clearBanners()
    const pendingBanners = generalStore.pendingBanners
    for (const pendingBanner of pendingBanners) {
      generalStore.addBanner(pendingBanner)
      console.log('banner:', pendingBanner)
    }
    generalStore.clearPendingBanners()
    next()
  })

  routerInstance = router

  return router
})
