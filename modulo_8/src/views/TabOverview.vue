<template>
  <div>
    <div class="page-header">
      <div>
        <div class="page-title">Gestão de Contratos</div>
        <div class="page-subtitle">
          Todos os editais vencidos, organizados para uma consulta rápida.
        </div>
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
          <div v-if="carregando" class="estado-vazio">
            <v-progress-circular
              indeterminate
              color="#2563eb"
              size="32"
            ></v-progress-circular>
            <span style="margin-top: 12px">Carregando editais...</span>
          </div>

          <div v-else-if="erro" class="estado-vazio erro">⚠️ {{ erro }}</div>

          <div v-else-if="editais.length === 0" class="estado-vazio">
            <span class="estado-icone">📭</span>
            <span class="estado-titulo">Nenhum edital ganho encontrado</span>
            <span class="estado-sub"
              >Quando sua empresa vencer uma licitação, ela aparecerá
              aqui.</span
            >
          </div>

          <v-data-table
            v-else
            :headers="headers"
            :items="editais"
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

            <template #item.pncp_id="{ item }">
              <span class="pncp-cell" :title="item.pncp_id">{{
                item.pncp_id || "—"
              }}</span>
            </template>

            <template #item.status="{ item }">
              <span class="badge-ganho">✅ Ganho</span>
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
  </div>
</template>

<script>
import { supabase } from "@/services/supabase";

export default {
  name: "TabOverview",
  data() {
    return {
      editais: [],
      carregando: false,
      erro: null,
      filtros: {
        nome: "",
        modalidade: "",
        cidade: "",
        dataAberturaInicio: "",
        dataAberturaFim: "",
      },
      modalidadesDisponiveis: [],
      headers: [
        { text: "Nome do Edital", value: "nome", sortable: true },
        { text: "Modalidade", value: "modalidade", sortable: true },
        { text: "Cidade", value: "cidade", sortable: true },
        { text: "Data de Abertura", value: "data_abertura", sortable: true },
        { text: "Data Fechamento", value: "data_fechamento", sortable: true },
        { text: "Status", value: "status", sortable: false },
        { text: "Ações", value: "acoes", sortable: false },
      ],
    };
  },
  async mounted() {
    await this.carregarEditais();
  },
  methods: {
    async carregarEditais() {
      this.carregando = true;
      this.erro = null;

      let query = supabase
        .from("mod1_editais")
        .select(
          `
      id,
      nome,
      modalidade,
      cidade,
      data_abertura,
      data_fechamento,
      status,
      descricao,
      arquivo_path
    `,
        )
        .eq("status", "GANHO");

      // Nome
      if (this.filtros.nome) {
        query = query.ilike("nome", `%${this.filtros.nome}%`);
      }

      // Modalidade
      if (this.filtros.modalidade) {
        query = query.eq("modalidade", this.filtros.modalidade);
      }

      // Cidade
      if (this.filtros.cidade) {
        query = query.ilike("cidade", `%${this.filtros.cidade}%`);
      }

      // Data inicial
      if (this.filtros.dataAberturaInicio) {
        query = query.gte("data_abertura", this.filtros.dataAberturaInicio);
      }

      // Data final
      if (this.filtros.dataAberturaFim) {
        query = query.lte("data_abertura", this.filtros.dataAberturaFim);
      }

      query = query.order("data_abertura", {
        ascending: false,
      });

      const { data, error } = await query;

      if (error) {
        console.error(error);
        this.erro = "Erro ao carregar editais.";
      } else {
        this.editais = data || [];
      }

      this.carregando = false;
    },
    async aplicarFiltros() {
      await this.carregarEditais();
    },
    async carregarModalidades() {
      const { data } = await supabase
        .from("mod1_editais")
        .select("modalidade")
        .eq("status", "ganho");

      this.modalidadesDisponiveis = [
        ...new Set((data || []).map((e) => e.modalidade).filter(Boolean)),
      ].sort();
    },
    async limparFiltros() {
      this.filtros = {
        nome: "",
        modalidade: "",
        cidade: "",
        dataAberturaInicio: "",
        dataAberturaFim: "",
      };

      await this.carregarEditais();
    },
    formatarData(data) {
      if (!data) return "—";
      return new Date(data).toLocaleDateString("pt-BR");
    },
    abrirContrato(edital) {
      this.$emit("abrir-contrato", edital);
    },
  },
  async mounted() {
    await Promise.all([this.carregarModalidades(), this.carregarEditais()]);
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
.estado-vazio.erro {
  color: #9f1239;
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

.pncp-cell {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 160px;
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
