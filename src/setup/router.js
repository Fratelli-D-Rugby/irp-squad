import { createWebHashHistory } from "vue-router"

import createRouter from '@/router/routes.js'

const router = createRouter(createWebHashHistory())

export default function setupRouter(app) {
  app.use(router)
  return router
}
