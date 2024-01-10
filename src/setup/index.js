import "./style"

import setupComponents from "./components"
import setupPinia from "./pinia"
import setupRouter from "./router"
import setupI18n from "./i18n"

export default function setup(app) {
  setupComponents(app)
  const router = setupRouter(app)
  const i18n = setupI18n(app)
  setupPinia(app, router, i18n)
  return app
}
