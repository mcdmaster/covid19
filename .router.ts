import Vue from '@nuxt/types'
import { Router } from 'vue-router'
import { normalizeURL } from 'ufo'

const emptyFn = () => {}
const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  
  routes: [{
    path: '/about',
    component: ['@/pages/about.vue'],
    name: 'about'
  }, {
    path: '/contacts',
    component: ['@/pages/contacts.vue'],
    name: 'contacts'
  }, {
    path: '/flow',
    component: ['@/pages/flow.vue'],
    name: 'flow'
  }, {
    path: '/parent',
    component: ['@/pages/parent.vue'],
    name: 'parent'
  }, {
    path: '/worker',
    component: ['@/pages/worker.vue'],
    name: 'worker'
  }, {
    path: '/print/flow',
    component: ['@/pages/print/flow.vue'],
    name: 'print-flow'
  }, {
    path: '/cards/:card?',
    component: ['@/pages/cards/_card.vue'],
    name: 'cards-card'
  }, {
    path: '/',
    component: ['@/pages/index.vue'],
    name: 'index'
  }],

  fallback: false,
}

export function createRouter (ssrContext: any, config: any): any {
  const base = (config.app && config.app.basePath) || routerOptions.base
  const router = Object(this as Router).prototype({ ...routerOptions, base })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}

export default routerOptions as ThisType<Router & typeof Vue>
