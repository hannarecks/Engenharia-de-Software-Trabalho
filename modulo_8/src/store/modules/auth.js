import { signIn, signUp, signOut, getSession } from '@/services/auth'
import { supabase } from '@/services/supabase'

export default {
  namespaced: true,
  state: {
    user: null,
    carregando: true,
    erro: null,
  },
  getters: {
    isLogado: (state) => !!state.user,
    user: (state) => state.user,
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user
    },
    SET_CARREGANDO(state, valor) {
      state.carregando = valor
    },
    SET_ERRO(state, erro) {
      state.erro = erro
    },
  },
  actions: {
    // Chamado uma vez, no main.js, antes de montar o app — garante
    // que o router já sabe se há sessão salva antes de decidir se
    // redireciona para /login.
    async init({ commit }) {
      const session = await getSession()
      commit('SET_USER', session?.user ?? null)
      commit('SET_CARREGANDO', false)

      supabase.auth.onAuthStateChange((_event, session) => {
        commit('SET_USER', session?.user ?? null)
      })
    },
    async login({ commit }, { email, password }) {
      commit('SET_ERRO', null)
      try {
        const user = await signIn(email, password)
        commit('SET_USER', user)
      } catch (err) {
        commit('SET_ERRO', 'E-mail ou senha incorretos.')
        throw err
      }
    },
    async register({ commit }, { email, password }) {
      commit('SET_ERRO', null)
      try {
        const user = await signUp(email, password)
        commit('SET_USER', user)
      } catch (err) {
        commit('SET_ERRO', err.message)
        throw err
      }
    },
    async logout({ commit }) {
      await signOut()
      commit('SET_USER', null)
    },
  },
}
