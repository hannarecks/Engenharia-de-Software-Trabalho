import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import contratos from './modules/contratos'
import divergencias from './modules/divergencias'
import pagamentos from './modules/pagamentos'
import documentos from './modules/documentos'
import alertas from './modules/alertas'


Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    contratos,
    divergencias,
    pagamentos,
    documentos,
    alertas,
  }
})
