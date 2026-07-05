import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/TabOverview.vue'
import TabCompare from '../views/TabCompare.vue'
import TabDivergencias from '@/views/TabDivergencias.vue'
import TabPagamentos from '@/views/TabPagamentos.vue'
import TabAlertas from '@/views/TabAlertas.vue'
import TabTarefas from '@/views/TabTarefas.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView
  },
  {
    path: "/compare",
    name: "compare",
    component: TabCompare
  },
  {
    path: "/divergencias",
    name: "divergencias",
    component: TabDivergencias
  },
  {
    path: "/pagamentos",
    name: "pagamentos",
    component: TabPagamentos
  },
  {
    path: "/alertas",
    name: "alertas",
    component: TabAlertas
  },
  {
  path: "/tarefas",
  name: "tarefas",
  component: TabTarefas
}
]

const router = new VueRouter({
  routes
})

export default router
