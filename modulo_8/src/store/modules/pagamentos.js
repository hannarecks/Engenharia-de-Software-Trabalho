import { listPagamentos, concluirEtapaPagamento } from '@/services/pagamentos'

export default {
  namespaced: true,
  state: {
    pagamentos: [],
    erro: null,
  },
  getters: {
    pagamentos: (state) => state.pagamentos,
    erro: (state) => state.erro,
  },
  mutations: {
    SET_PAGAMENTOS(state, pagamentos) {
      state.pagamentos = pagamentos
    },
    SET_ERRO(state, erro) {
      state.erro = erro
    },
  },
  actions: {
    async fetchPagamentos({ commit }, contratoId) {
      try {
        const data = await listPagamentos(contratoId)
        commit('SET_PAGAMENTOS', data)
      } catch (err) {
        commit('SET_ERRO', 'Não foi possível carregar os pagamentos.')
        console.error(err)
      }
    },
    async concluirEtapa({ commit, dispatch }, { pagamentoId, contratoId }) {
      commit('SET_ERRO', null)
      try {
        await concluirEtapaPagamento(pagamentoId)
        await dispatch('fetchPagamentos', contratoId)
      } catch (err) {
        commit('SET_ERRO', err.message)
      }
    },
  },
}
