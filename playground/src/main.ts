import FloatingVue from 'floating-vue'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import App from './App.vue'

import '@unocss/reset/tailwind.css'
import 'uno.css'
import 'floating-vue/dist/style.css'

const isMobile = typeof navigator !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

const app = createApp(App)
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
app.use(FloatingVue, {
  themes: {
    tooltip: {
      $extend: 'dropdown',
      triggers: isMobile ? ['touch'] : ['hover', 'touch'],
      popperTriggers: isMobile ? ['touch'] : ['hover', 'touch'],
      placement: 'bottom-start',
      overflowPadding: 10,
      delay: 0,
      handleResize: false,
      autoHide: true,
      instantMove: true,
      flip: false,
      arrowPadding: 8,
      autoBoundaryMaxSize: true,
    },
  },
})
app.use(router)
app.mount('#app')
