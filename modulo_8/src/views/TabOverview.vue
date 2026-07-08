<template>
  <div>
    <div class="page-header">
      <div>
        <div class="page-title">Gestão de Contratos</div>
        <div class="page-subtitle">Editais vencidos, disponíveis para geração de contrato</div>
      </div>
    </div>

    <!-- Painel de Filtros -->
    <v-row no-gutters>
      <v-col class="kpi-card" cols="12">
        <h3 class="filtros-title">Filtros</h3>

        <div class="filtros-grid">
          <div class="filtro-wrap">
            <label class="filtro-label">Nome do Edital</label>
            <input
              v-model="filtros.nome"
              type="text"
              placeholder="Buscar por nome..."
              class="filtro-input"
            />
          </div>

          <div class="filtro-wrap">
            <label class="filtro-label">Modalidade</label>
            <select v-model="filtros.modalidade" class="filtro-input">
              <option value="">Todas</option>
              <option v-for="m in modalidadesDisponiveis" :key="m" :value="m">
                {{ m }}
              </option>
            </select>
          </div>

          <div class="filtro-wrap">
            <label class="filtro-label">Cidade</label>
            <input
              v-model="filtros.cidade"
              type="text"
              placeholder="Buscar por cidade..."
              class="filtro-input"
            />
          </div>

          <div class="filtro-wrap">
            <label class="filtro-label">Abertura — De</label>
            <input
              v-model="filtros.dataAberturaInicio"
              type="date"
              class="filtro-input"
            />
          </div>

          <div class="filtro-wrap">
            <label class="filtro-label">Abertura — Até</label>
            <input
              v-model="filtros.dataAberturaFim"
              type="date"
              class="filtro-input"
            />
          </div>
        </div>

        <div class="filtros-actions">
          <button class="filtrar-btn" @click="aplicarFiltros">Filtrar</button>
          <button class="limpar-btn" @click="limparFiltros">Limpar</button>
        </div>
      </v-col>
    </v-row>

    <!-- Tabela -->
    <v-row no-gutters style="margin-top: 20px">
      <v-col cols="12">
        <div class="kpi-card">
          <div v-if="editaisFiltrados.length === 0" class="estado-vazio">
            <span class="estado-icone">📭</span>
            <span class="estado-titulo">Nenhum edital encontrado</span>
            <span class="estado-sub"
              >Tente ajustar os filtros para ver mais resultados.</span
            >
          </div>

          <v-data-table
            v-else
            :headers="headers"
            :items="editaisFiltrados"
            :items-per-page="10"
            class="editais-table"
          >
            <template #item.nome="{ item }">
              <span class="nome-cell" :title="item.nome">{{
                item.nome || "—"
              }}</span>
            </template>

            <template #item.modalidade="{ item }">
              <span class="badge-modalidade">{{ item.modalidade || "—" }}</span>
            </template>

            <template #item.cidade="{ item }">
              <span>{{ item.cidade || "—" }}</span>
            </template>

            <template #item.data_abertura="{ item }">
              <span>{{ formatarData(item.data_abertura) }}</span>
            </template>

            <template #item.data_fechamento="{ item }">
              <span>{{ formatarData(item.data_fechamento) }}</span>
            </template>

            <template #item.status="{ item }">
              <span class="badge-ganho">Ganho</span>
            </template>

            <template #item.acoes="{ item }">
              <button class="btn-ver" @click="abrirContrato(item)">
                Ver contrato
              </button>
            </template>
          </v-data-table>
        </div>
      </v-col>
    </v-row>
    <!-- Modal de detalhes do contrato -->
    <ContratoModal
      v-model="modalAberto"
      :edital="editalSelecionado"
      @participar="onParticipar"
      @sucesso="onCadastroSucesso"
      @erro="onCadastroErro"
    />

    <v-snackbar
      v-model="snackbar.aberto"
      :color="snackbar.cor"
      :timeout="4000"
      bottom
    >
      {{ snackbar.texto }}
      <template #action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar.aberto = false">
          Fechar
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import ContratoModal from "@/components/ContratoModal.vue";
import CadastroContratoModal from "@/components/CadastroContratoModal.vue";

export default {
  name: "TabOverview",
  components: {
    ContratoModal,
    CadastroContratoModal,
  },
  data() {
    return {
      modalAberto: false,
      cadastroAberto: false,
      editalSelecionado: null,
      snackbar: {
        aberto: false,
        texto: "",
        cor: "success",
      },
      filtros: {
        nome: "",
        modalidade: "",
        cidade: "",
        dataAberturaInicio: "",
        dataAberturaFim: "",
      },
      filtrosAtivos: {
        nome: "",
        modalidade: "",
        cidade: "",
        dataAberturaInicio: "",
        dataAberturaFim: "",
      },
      headers: [
        { text: "Nome do Edital", value: "nome", sortable: true },
        { text: "Modalidade", value: "modalidade", sortable: true },
        { text: "Cidade", value: "cidade", sortable: true },
        { text: "Data de Abertura", value: "data_abertura", sortable: true },
        { text: "Data Fechamento", value: "data_fechamento", sortable: true },
        { text: "Status", value: "status", sortable: false },
        { text: "Ações", value: "acoes", sortable: false },
      ],
      editais: [
        {
          id: 1,
          nome: "Pregão Eletrônico nº 07/2026 — Limpeza e Manutenção de Áreas Verdes",
          modalidade: "Pregão Eletrônico",
          cidade: "São Paulo",
          data_abertura: "2026-03-10T09:00:00",
          data_fechamento: "2027-03-10T09:00:00",
          status: "GANHO",
          descricao:
            "Contratação de empresa para limpeza e manutenção de áreas verdes municipais.",
          arquivo_path: null,
        },
        {
          id: 2,
          nome: "Concorrência Pública nº 02/2026 — Fornecimento de Equipamentos de TI",
          modalidade: "Concorrência",
          cidade: "Campinas",
          data_abertura: "2026-02-15T10:00:00",
          data_fechamento: "2027-02-15T10:00:00",
          status: "GANHO",
          descricao: "Aquisição de computadores, notebooks e periféricos.",
          arquivo_path: null,
        },
        {
          id: 3,
          nome: "Pregão Eletrônico nº 12/2026 — Serviços de Segurança Patrimonial",
          modalidade: "Pregão Eletrônico",
          cidade: "Rio de Janeiro",
          data_abertura: "2026-04-01T08:00:00",
          data_fechamento: "2027-04-01T08:00:00",
          status: "GANHO",
          descricao:
            "Prestação de serviços de vigilância e segurança patrimonial.",
          arquivo_path: null,
        },
        {
          id: 4,
          nome: "Dispensa de Licitação nº 05/2026 — Manutenção Predial",
          modalidade: "Dispensa",
          cidade: "Belo Horizonte",
          data_abertura: "2026-01-20T14:00:00",
          data_fechamento: "2026-07-20T14:00:00",
          status: "GANHO",
          descricao:
            "Serviços de manutenção preventiva e corretiva das instalações.",
          arquivo_path: null,
        },
        {
          id: 5,
          nome: "Pregão Eletrônico nº 18/2026 — Material de Escritório",
          modalidade: "Pregão Eletrônico",
          cidade: "Curitiba",
          data_abertura: "2026-05-05T09:30:00",
          data_fechamento: "2027-05-05T09:30:00",
          status: "GANHO",
          descricao: "Fornecimento de materiais de expediente e escritório.",
          arquivo_path: null,
        },
        {
          id: 6,
          nome: "Concorrência Pública nº 04/2026 — Obra de Pavimentação",
          modalidade: "Concorrência",
          cidade: "São Paulo",
          data_abertura: "2026-03-25T10:00:00",
          data_fechamento: "2028-03-25T10:00:00",
          status: "GANHO",
          descricao:
            "Execução de obras de pavimentação asfáltica em vias urbanas.",
          arquivo_path: null,
        },
      ],
    };
  },
  computed: {
    modalidadesDisponiveis() {
      return [
        ...new Set(this.editais.map((e) => e.modalidade).filter(Boolean)),
      ].sort();
    },
    editaisFiltrados() {
      return this.editais.filter((e) => {
        if (
          this.filtrosAtivos.nome &&
          !e.nome.toLowerCase().includes(this.filtrosAtivos.nome.toLowerCase())
        )
          return false;

        if (
          this.filtrosAtivos.modalidade &&
          e.modalidade !== this.filtrosAtivos.modalidade
        )
          return false;

        if (
          this.filtrosAtivos.cidade &&
          !e.cidade
            .toLowerCase()
            .includes(this.filtrosAtivos.cidade.toLowerCase())
        )
          return false;

        if (this.filtrosAtivos.dataAberturaInicio) {
          if (
            new Date(e.data_abertura) <
            new Date(this.filtrosAtivos.dataAberturaInicio)
          )
            return false;
        }

        if (this.filtrosAtivos.dataAberturaFim) {
          if (
            new Date(e.data_abertura) >
            new Date(this.filtrosAtivos.dataAberturaFim)
          )
            return false;
        }

        return true;
      });
    },
  },
  methods: {
    aplicarFiltros() {
      this.filtrosAtivos = { ...this.filtros };
    },

    limparFiltros() {
      this.filtros = {
        nome: "",
        modalidade: "",
        cidade: "",
        dataAberturaInicio: "",
        dataAberturaFim: "",
      };
      this.filtrosAtivos = { ...this.filtros };
    },

    formatarData(data) {
      if (!data) return "—";
      return new Date(data).toLocaleDateString("pt-BR");
    },

    abrirContrato(edital) {
      this.editalSelecionado = edital;
      this.modalAberto = true;
    },

    onParticipar(edital) {
      this.editalSelecionado = edital;
      this.cadastroAberto = true;
    },

    onCadastroSucesso() {
      this.snackbar = {
        aberto: true,
        texto: "Contrato cadastrado com sucesso!",
        cor: "success",
      };
    },

    onCadastroErro(mensagem) {
      this.snackbar = {
        aberto: true,
        texto: mensagem || "Erro ao cadastrar o contrato. Tente novamente.",
        cor: "error",
      };
    },
  },
};
</script>

<style scoped>
.kpi-card {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 20px 24px 24px !important;
  box-shadow: var(--shadow);
}

.filtros-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-h, #1e293b);
  margin-bottom: 16px;
}

.filtros-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 14px;
  margin-bottom: 4px;
}

.filtro-wrap {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.filtro-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-m, #64748b);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.filtro-input {
  width: 100%;
  padding: 9px 12px;
  border-radius: 8px;
  border: 1px solid var(--border, #e2e8f0);
  background: #f8fafc;
  font-size: 13.5px;
  color: #1e293b;
  outline: none;
  transition: border-color 0.2s;
  appearance: auto;
  box-sizing: border-box;
}

.filtro-input:focus {
  border-color: #2563eb;
  background: #fff;
}

.filtro-input::placeholder {
  color: #94a3b8;
}

.filtros-actions {
  display: flex;
  gap: 10px;
  margin-top: 18px;
}

.filtrar-btn,
.limpar-btn {
  padding: 9px 18px;
  border-radius: 8px;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: background-color 0.2s ease;
}

.filtrar-btn {
  background-color: #2563eb;
  color: #fff;
}
.filtrar-btn:hover {
  background-color: #1d4ed8;
}
.limpar-btn {
  background: transparent;
  color: #475569;
  border: 1px solid var(--border, #e2e8f0);
}
.limpar-btn:hover {
  background: #f1f5f9;
}

.estado-vazio {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  gap: 8px;
  color: var(--text-m, #64748b);
}
.estado-icone {
  font-size: 36px;
}
.estado-titulo {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-h);
}
.estado-sub {
  font-size: 13px;
  color: var(--text-m);
}

.editais-table ::v-deep th {
  font-size: 12px !important;
  font-weight: 700 !important;
  color: var(--text-m) !important;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  background: #f8fafc !important;
}

.editais-table ::v-deep td {
  font-size: 13.5px;
  color: var(--text-b);
  border-bottom: 1px solid var(--border) !important;
}

.editais-table ::v-deep tr:hover td {
  background: #f8fafc;
}

.nome-cell {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  max-width: 260px;
}

.badge-modalidade {
  font-size: 11.5px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
  background: #eff6ff;
  color: #1d4ed8;
}

.badge-ganho {
  font-size: 12px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
  background: #dcfce7;
  color: #166534;
}

.btn-ver {
  font-size: 12.5px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 7px;
  border: 1px solid #2563eb;
  color: #2563eb;
  background: transparent;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-ver:hover {
  background: #eff6ff;
}
</style>
