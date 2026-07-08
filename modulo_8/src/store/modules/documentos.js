import { listDocumentos } from '@/services/documentos'

export default {
  namespaced: true,
  state: {
    documentos: [],
    erro: null,
  },
  getters: {
    documentos: (state) => state.documentos,
    erro: (state) => state.erro,
  },
  mutations: {
    SET_DOCUMENTOS(state, documentos) {
      state.documentos = documentos
    },
    SET_ERRO(state, erro) {
      state.erro = erro
    },
  },
  actions: {
    async fetchDocumentos({ commit }, contratoId) {
      try {
        const data = await listDocumentos(contratoId)
        commit('SET_DOCUMENTOS', data)
      } catch (err) {
        commit('SET_ERRO', 'Não foi possível carregar os documentos vinculados.')
        console.error(err)
      }
    },
  },
}
