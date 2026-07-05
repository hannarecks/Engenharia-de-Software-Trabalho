import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/TabOverview.vue'
import TabCompare from '../views/TabCompare.vue'
import TabDivergencias from '@/views/TabDivergencias.vue'
import TabPagamentos from '@/views/TabPagamentos.vue'
import Login from '@/views/Login.vue'
import store from '@/store'

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
    path: "/login",
    name: "login",
    component: Login
  }
]

const router = new VueRouter({
  routes
})

// Bloqueia qualquer rota que não seja "login" enquanto não houver sessão ativa
router.beforeEach((to, from, next) => {
  const logado = store.getters['auth/isLogado']
  if (to.name !== 'login' && !logado) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
