import { listDivergencias, marcarResolvida } from '@/services/divergencias'

export default {
  namespaced: true,
  state: {
    divergencias: [],
    erro: null,
  },
  getters: {
    divergencias: (state) => state.divergencias,
    abertas: (state) => state.divergencias.filter(d => !d.resolvida),
  },
  mutations: {
    SET_DIVERGENCIAS(state, divergencias) {
      state.divergencias = divergencias
    },
    SET_ERRO(state, erro) {
      state.erro = erro
    },
  },
  actions: {
    async fetchDivergencias({ commit }, contratoId) {
      try {
        const data = await listDivergencias(contratoId)
        commit('SET_DIVERGENCIAS', data)
      } catch (err) {
        commit('SET_ERRO', 'Não foi possível carregar o relatório de divergências.')
        console.error(err)
      }
    },
    async resolver({ dispatch }, { id, contratoId }) {
      await marcarResolvida(id)
      await dispatch('fetchDivergencias', contratoId)
    },
  },
}
