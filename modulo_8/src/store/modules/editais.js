import { listEditais } from "@/services/editais";
import { formatEdital } from "@/models/edital";

export default {
  namespaced: true,
  state: {
    editais: [],
    carregando: false,
    erro: null,
  },
  getters: {
    editais: (state) => state.editais,
    carregando: (state) => state.carregando,
    erro: (state) => state.erro,
  },
  mutations: {
    SET_EDITAIS(state, editais) {
      state.editais = editais;
    },
    SET_CARREGANDO(state, valor) {
      state.carregando = valor;
    },
    SET_ERRO(state, erro) {
      state.erro = erro;
    },
  },
  actions: {
    async fetchEditais({ commit }) {
      commit("SET_CARREGANDO", true);
      commit("SET_ERRO", null);
      try {
        const rows = await listEditais();
        commit("SET_EDITAIS", rows.map(formatEdital));
      } catch (err) {
        commit(
          "SET_ERRO",
          "Não foi possível carregar os editais. Tente novamente.",
        );
        console.error(err);
      } finally {
        commit("SET_CARREGANDO", false);
      }
    },
  },
};
