import { listAlertas } from '@/services/alertas'

export default {
  namespaced: true,
  state: {
    alertas: [],
    erro: null,
  },
  getters: {
    alertas: (state) => state.alertas,
    erro: (state) => state.erro,
  },
  mutations: {
    SET_ALERTAS(state, alertas) {
      state.alertas = alertas
    },
    SET_ERRO(state, erro) {
      state.erro = erro
    },
  },
  actions: {
    async fetchAlertas({ commit }, contratoId) {
      try {
        const data = await listAlertas(contratoId)
        commit('SET_ALERTAS', data)
      } catch (err) {
        commit('SET_ERRO', 'Não foi possível carregar os alertas.')
        console.error(err)
      }
    },
  },
}
