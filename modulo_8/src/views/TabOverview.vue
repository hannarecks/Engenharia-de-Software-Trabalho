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

    <v-row no-gutters>
      <v-col class="kpi-card" cols="12">
        <h3 class="filtros-title">Filtros</h3>

        <v-row class="filtros-row">
          <v-col cols="12" md="3">
            <v-text-field
              v-model="filtros.numeroEdital"
              label="Número do Edital"
              solo
              flat
              clearable
              hide-details
              class="filtro-input"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="3">
            <v-text-field
              v-model="filtros.dataInicio"
              label="Data de Início"
              type="date"
              solo
              flat
              clearable
              hide-details
              class="filtro-input"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="3">
            <v-text-field
              v-model="filtros.dataFim"
              label="Data de Fim"
              type="date"
              solo
              flat
              clearable
              hide-details
              class="filtro-input"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="3">
            <v-text-field
              v-model="filtros.orgaoPublico"
              label="Órgão Público"
              solo
              flat
              clearable
              hide-details
              class="filtro-input"
            ></v-text-field>
          </v-col>
        </v-row>

        <div class="filtros-actions">
          <button class="filtrar-btn">
            Filtrar
          </button>
          <button @click="limparFiltros" class="limpar-btn">
            Limpar
          </button>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { documents, alerts } from '@/data/mockData'

export default {
  name: 'TabOverview',
  data() {
    return {
      documents,
      alerts,
      steps: [
        { state: 'done',    icon: '✓', label: 'Adjudicação' },
        { state: 'done',    icon: '✓', label: 'Homologação' },
        { state: 'done',    icon: '✓', label: 'Assinatura'  },
        { state: 'active',  icon: '▶', label: 'Execução'    },
        { state: 'pending', icon: '5', label: 'Medição'     },
        { state: 'pending', icon: '6', label: 'Pagamento'   },
        { state: 'pending', icon: '7', label: 'Encerramento'},
      ],
      filtros: {
        numeroEdital: '',
        dataInicio: '',
        dataFim: '',
        orgaoPublico: '',
      },
    }
  },
  methods: {
    limparFiltros(){
      this.filtros.numeroEdital = "";
      this.filtros.dataInicio = "";
      this.filtros.dataFim = "";
      this.filtros.orgaoPublico = "";
    }
  }
  
}
</script>

<style scoped>

.painel-filtros {
  padding: 15px;
}

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
}

.filtros-row {
  margin: 0 -8px;
}

.filtros-row > .v-col {
  padding: 0 8px;
}

/* Inputs */
.filtro-input ::v-deep .v-input__slot {
  border-radius: 8px !important;
  border: 1px solid var(--border, #e2e8f0) !important;
  box-shadow: none !important;
  background: #f8fafc !important;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.filtro-input ::v-deep .v-input__slot:hover {
  border-color: #94a3b8 !important;
}

.filtro-input.v-input--is-focused ::v-deep .v-input__slot {
  border-color: #2563eb !important;
  background: var(--white) !important;
}

.filtro-input ::v-deep .v-label,
.filtro-input ::v-deep input {
  font-size: 14px !important;
}

.filtro-input ::v-deep input {
  color: #1e293b !important;
}

/* Ações */
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
  letter-spacing: 0.3px;
  cursor: pointer;
  border: none;
  transition: background-color 0.2s ease, box-shadow 0.2s ease, transform 0.05s ease;
}

.filtrar-btn {
  background-color: #2563eb;
  color: #fff;
}

.filtrar-btn:hover {
  background-color: #1d4ed8;
}

.filtrar-btn:active {
  transform: translateY(1px);
}

.filtrar-btn:focus-visible {
  outline: 2px solid #93c5fd;
  outline-offset: 2px;
}

.limpar-btn {
  background-color: transparent;
  color: #475569;
  border: 1px solid var(--border, #e2e8f0);
}

.limpar-btn:hover {
  background-color: #f1f5f9;
}

.contract-timeline-wrap {
  background: var(--white); border: 1px solid var(--border);
  border-radius: 10px; padding: 18px; box-shadow: var(--shadow); margin-bottom: 22px;
}
.ct-header { margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between; }
.ct-title { font-size: 13px; font-weight: 600; color: var(--text-h); }
.ct-phase { font-size: 12px; color: var(--text-m); margin-top: 2px; }

.ct-steps { display: flex; align-items: center; }
.ct-step {
  display: flex; flex-direction: column; align-items: center;
  position: relative; flex: 1;
}
.ct-step:not(:last-child)::after {
  content: ''; position: absolute; top: 14px; left: 50%; width: 100%;
  height: 2px; z-index: 0; background: var(--ice-mid);
}
.ct-step.done:not(:last-child)::after   { background: var(--emerald); }
.ct-step.active:not(:last-child)::after { background: linear-gradient(to right, var(--emerald), var(--ice-mid)); }

.ct-circle {
  width: 28px; height: 28px; border-radius: 50%;
  border: 2px solid var(--ice-mid); background: var(--white);
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; z-index: 1; position: relative; transition: all 0.2s;
}
.ct-step.done   .ct-circle { border-color: var(--emerald); background: var(--emerald); color: #fff; }
.ct-step.active .ct-circle { border-color: var(--navy); background: var(--navy); color: #fff; box-shadow: 0 0 0 4px rgba(27,44,78,0.12); }
.ct-step.pending .ct-circle { border-color: var(--border); color: var(--text-m); }

.ct-label { font-size: 11px; color: var(--text-m); margin-top: 6px; text-align: center; font-weight: 500; white-space: nowrap; }
.ct-step.active .ct-label  { color: var(--navy); font-weight: 700; }
.ct-step.done   .ct-label  { color: var(--emerald); font-weight: 600; }

.progress-labels {
  display: flex; justify-content: space-between;
  font-size: 11.5px; color: var(--text-m); margin-bottom: 4px;
}
.progress-value { font-weight: 600; color: var(--text-b); }
.see-all-link { font-size: 12.5px; color: var(--blue-acc); cursor: pointer; font-weight: 500; }
</style>