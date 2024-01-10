import { createRouter } from 'vue-router'
import SquadSelection from '@/views/SquadSelection.vue'
import Privacy from '@/views/Privacy.vue'
import Tos from '@/views/Tos.vue'

const routes = [
  {
    path: '/',
    name: 'squad',
    component: SquadSelection
  },
  {
    path: '/fans',
    name: 'fan-squad',
    component: SquadSelection
  },
  {
    path: '/share/:id',
    name: 'shared-squad',
    component: SquadSelection
  },
  { 
    path: '/privacy-policy',
    name: 'privacy-policy',
    component: Privacy
  },
  { 
    path: '/tos',
    name: 'tos',
    component: Tos
  }
]

export default function (history) {
  const router = createRouter({
    history,
    routes
  })
  router.beforeEach(async (to) => {
    const privatePages = []
    const authRequired = privatePages.includes(to.path)
    if (authRequired) {
    }
  })
  return router
}

