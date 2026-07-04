<template>
  <div>
    <div class="page-header">
      <div>
        <div class="page-title">Gestão de Contratos</div>
        <div class="page-subtitle">
          CTR-2024-0047 · Fornecimento de Equipamentos de TI · PMSP · Vigência: 12/2024 – 11/2025
        </div>
      </div>
    </div>

    <!-- KPIs -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-label">Valor Total do Contrato</div>
        <div class="kpi-value">R$&nbsp;1,24M</div>
        <div class="kpi-sub">Vigência: 12 meses</div>
        <div class="kpi-accent-bar blue"></div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Valor Pago</div>
        <div class="kpi-value">R$&nbsp;517K</div>
        <div class="kpi-sub"><span class="kpi-change up">↑ 41,7%</span> do total</div>
        <div class="kpi-accent-bar green"></div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Pagamentos Pendentes</div>
        <div class="kpi-value">R$&nbsp;208K</div>
        <div class="kpi-sub"><span class="kpi-change warn">⚠ 1 em atraso</span></div>
        <div class="kpi-accent-bar amber"></div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Divergências Abertas</div>
        <div class="kpi-value">5</div>
        <div class="kpi-sub"><span class="kpi-change down">● 2 de alta prioridade</span></div>
        <div class="kpi-accent-bar red"></div>
      </div>
    </div>

    <!-- Contract Timeline -->
    <div class="contract-timeline-wrap">
      <div class="ct-header">
        <div>
          <div class="ct-title">Ciclo de Vida do Contrato</div>
          <div class="ct-phase">Fase atual: <strong>Execução e Entregas</strong></div>
        </div>
        <div class="badge green">
          <div class="badge-dot-sm" style="background: var(--emerald)"></div>
          Em execução
        </div>
      </div>

      <div class="ct-steps">
        <div
          v-for="step in steps"
          :key="step.label"
          class="ct-step"
          :class="step.state"
        >
          <div class="ct-circle">{{ step.icon }}</div>
          <div class="ct-label">{{ step.label }}</div>
        </div>
      </div>

      <div style="margin-top: 14px">
        <div class="progress-labels">
          <span>Progresso financeiro</span>
          <span class="progress-value">41,7% executado</span>
        </div>
        <div class="progress-bar-wrap">
          <div class="progress-bar-fill" style="width: 41.7%; background: var(--emerald)"></div>
        </div>
      </div>
    </div>

    <!-- Two Columns -->
    <div class="two-col">
      <!-- Documents -->
      <div class="panel">
        <div class="panel-header">
          <div>
            <div class="panel-title">📁 Documentos Vinculados</div>
            <div class="panel-subtitle">Artefatos do processo licitatório</div>
          </div>
          <button class="btn-secondary" style="font-size: 12px; padding: 5px 10px">+ Anexar</button>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Documento</th>
              <th>Tipo</th>
              <th>Data</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="doc in documents" :key="doc.id">
              <td>
                <div style="font-weight: 500; color: var(--text-h)">{{ doc.name }}</div>
                <div class="mono" style="color: var(--text-m)">{{ doc.id }}</div>
              </td>
              <td><span class="badge gray">{{ doc.type }}</span></td>
              <td style="color: var(--text-m)">{{ doc.date }}</td>
              <td><span class="badge" :class="doc.statusClass">{{ doc.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Recent Alerts -->
      <div class="panel">
        <div class="panel-header">
          <div>
            <div class="panel-title">🔔 Alertas Recentes</div>
            <div class="panel-subtitle">Últimas 48 horas</div>
          </div>
          <a class="see-all-link" @click="$emit('change-tab', 'alertas')">Ver todos</a>
        </div>
        <div class="panel-body">
          <div
            v-for="alert in alerts.slice(0, 3)"
            :key="alert.id"
            class="alert-item"
            :class="alert.type"
          >
            <div class="alert-icon">{{ alert.icon }}</div>
            <div class="alert-content">
              <div class="alert-title">{{ alert.title }}</div>
              <div class="alert-body">{{ alert.body }}</div>
              <div class="alert-time">{{ alert.time }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
    }
  },
}
</script>

<style scoped>
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
