import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import contratos from './modules/contratos'
import divergencias from './modules/divergencias'
import pagamentos from './modules/pagamentos'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    contratos,
    divergencias,
    pagamentos,
  }
})
