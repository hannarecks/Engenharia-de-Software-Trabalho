import { listContratos, getContrato, updateContrato } from '@/services/contratos'
import { formatContrato } from '@/models/contrato'

export default {
  namespaced: true,
  state: {
    contratos: [],
    contratoAtual: null,
    carregando: false,
    erro: null,
  },
  getters: {
    contratos: (state) => state.contratos,
    contratoAtual: (state) => state.contratoAtual,
  },
  mutations: {
    SET_CONTRATOS(state, contratos) {
      state.contratos = contratos
    },
    SET_CONTRATO_ATUAL(state, contrato) {
      state.contratoAtual = contrato
    },
    SET_CARREGANDO(state, valor) {
      state.carregando = valor
    },
    SET_ERRO(state, erro) {
      state.erro = erro
    },
  },
  actions: {
    async fetchContratos({ commit }) {
      commit('SET_CARREGANDO', true)
      commit('SET_ERRO', null)
      try {
        const rows = await listContratos()
        commit('SET_CONTRATOS', rows.map(formatContrato))
      } catch (err) {
        commit('SET_ERRO', 'Não foi possível carregar os contratos. Tente novamente.')
        console.error(err)
      } finally {
        commit('SET_CARREGANDO', false)
      }
    },
    async fetchContrato({ commit }, id) {
      commit('SET_CARREGANDO', true)
      commit('SET_ERRO', null)
      try {
        const row = await getContrato(id)
        commit('SET_CONTRATO_ATUAL', formatContrato(row))
      } catch (err) {
        commit('SET_ERRO', 'Não foi possível processar o documento. Verifique e tente novamente.')
        console.error(err)
      } finally {
        commit('SET_CARREGANDO', false)
      }
    },

    async fetchContratoPrincipal({ state, dispatch }) {
      if (state.contratos.length === 0) {
        await dispatch('fetchContratos')
      }
      const primeiro = state.contratos[0]
      if (primeiro && (!state.contratoAtual || state.contratoAtual.id !== primeiro.id)) {
        await dispatch('fetchContrato', primeiro.id)
      }
    },

    async salvarCampoManual({ state, dispatch }, { id, campo, valor }) {
      const camposAtuais = state.contratoAtual?.camposEditados || {}
      await updateContrato(id, {
        [campo]: valor,
        campos_editados_manualmente: { ...camposAtuais, [campo]: true },
      })
      await dispatch('fetchContrato', id)
    },
  },
}
