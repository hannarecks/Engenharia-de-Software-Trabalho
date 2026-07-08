<template>
  <div>
    <div class="page-header">
      <div>
        <div class="page-title">Relatório de Divergências</div>
        <div class="page-subtitle">{{ divergenciasFormatadas.length }} ocorrência(s) identificada(s)</div>
      </div>
      <div class="flex-row">
        <button class="btn-secondary">📄 Exportar PDF</button>
        <button class="btn-primary">📧 Notificar órgão</button>
      </div>
    </div>

    <div class="three-col">
      <!-- Divergence list -->
      <div class="panel">
        <div class="panel-header">
          <div>
            <div class="panel-title">Divergências Identificadas</div>
            <div class="panel-subtitle">Ordenadas por severidade</div>
          </div>
          <select class="form-input" style="font-size: 12px; padding: 4px 8px; width: auto" v-model="filter">
            <option value="">Todas</option>
            <option value="high">Alta</option>
            <option value="medium">Média</option>
            <option value="low">Baixa</option>
          </select>
        </div>
        <div class="panel-body">
          <div
            v-for="div in filteredDivergencias"
            :key="div.id"
            class="divergence-item"
          >
            <div class="div-severity" :class="div.sev"></div>
            <div style="flex: 1">
              <div class="div-badges">
                <span class="badge" :class="severityBadgeClass(div.sev)">
                  {{ severityLabel(div.sev) }}
                </span>
                <span class="mono" style="color: var(--text-m); font-size: 11px">{{ div.id }}</span>
              </div>
              <div class="div-title">{{ div.title }}</div>
              <div class="div-desc">{{ div.desc }}</div>
              <div class="div-meta">
                <span class="div-tag">{{ div.campo }}</span>
                <span class="badge" :class="div.statusClass" style="font-size: 11px">{{ div.status }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar summaries -->
      <div>
        <div class="panel" style="margin-bottom: 16px">
          <div class="panel-header">
            <div class="panel-title">📊 Resumo por Severidade</div>
          </div>
          <div class="panel-body">
            <div v-for="s in severitySummary" :key="s.label" style="margin-bottom: 14px">
              <div class="summary-row">
                <span style="font-weight: 600; color: var(--text-b)">{{ s.label }}</span>
                <span style="font-family: 'JetBrains Mono', monospace; font-size: 12px">{{ s.count }}/{{ s.total }}</span>
              </div>
              <div class="progress-bar-wrap">
                <div class="progress-bar-fill" :style="{ width: (s.count / s.total * 100) + '%', background: s.color }"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="panel">
          <div class="panel-header">
            <div class="panel-title">📋 Por Campo</div>
          </div>
          <div class="panel-body">
            <div
              v-for="c in categoryCount"
              :key="c.name"
              class="category-row"
            >
              <span style="font-size: 13px; color: var(--text-b)">{{ c.name }}</span>
              <span class="badge gray">{{ c.n }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDivergencia } from '@/models/divergencia'

export default {
  name: 'TabDivergencias',
  data() {
    return {
      filter: '',
    }
  },
  computed: {
    divergenciasFormatadas() {
      return this.$store.getters['divergencias/divergencias'].map(formatDivergencia)
    },
    filteredDivergencias() {
      if (!this.filter) return this.divergenciasFormatadas
      return this.divergenciasFormatadas.filter(d => d.sev === this.filter)
    },
    // Substitui o mock severitySummary: soma real das divergências
    // carregadas, agrupadas pela mesma severidade usada nos badges.
    severitySummary() {
      const total = this.divergenciasFormatadas.length
      const contagem = { high: 0, medium: 0, low: 0 }
      this.divergenciasFormatadas.forEach((d) => { contagem[d.sev] = (contagem[d.sev] || 0) + 1 })
      return [
        { label: 'Alta', count: contagem.high, total: total || 1, color: '#EF4444' },
        { label: 'Média', count: contagem.medium, total: total || 1, color: '#B45309' },
        { label: 'Baixa', count: contagem.low, total: total || 1, color: '#2563EB' },
      ]
    },
    // Substitui o mock categoryCount: mod8_divergencia não tem coluna
    // de categoria, então agrupamos pelo campo divergente (o dado real
    // mais próximo disso que existe no schema).
    categoryCount() {
      const contagem = {}
      this.divergenciasFormatadas.forEach((d) => {
        contagem[d.campo] = (contagem[d.campo] || 0) + 1
      })
      return Object.entries(contagem).map(([name, n]) => ({ name, n }))
    },
  },
  async created() {
    await this.$store.dispatch('contratos/fetchContratoPrincipal')
    const contrato = this.$store.getters['contratos/contratoAtual']
    if (contrato) {
      this.$store.dispatch('divergencias/fetchDivergencias', contrato.id)
    }  // TODO: back ai
  },
  methods: {
    severityLabel(sev) {
      return { high: 'Alta', medium: 'Média', low: 'Baixa' }[sev]
    },
    severityBadgeClass(sev) {
      return { high: 'red', medium: 'amber', low: 'blue' }[sev]
    },
  },
}
</script>

<style scoped>
.divergence-item {
  display: flex; gap: 14px; padding: 14px 0;
  border-bottom: 1px solid var(--ice-mid);
}
.divergence-item:last-child { border-bottom: none; }

.div-severity { width: 4px; border-radius: 2px; flex-shrink: 0; align-self: stretch; }
.div-severity.high   { background: #EF4444; }
.div-severity.medium { background: var(--amber); }
.div-severity.low    { background: var(--blue-acc); }

.div-badges { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
.div-title  { font-size: 13.5px; font-weight: 600; color: var(--text-h); margin-bottom: 3px; }
.div-desc   { font-size: 12.5px; color: var(--text-m); }
.div-meta   { display: flex; gap: 10px; margin-top: 6px; flex-wrap: wrap; }
.div-tag    { font-size: 11px; background: var(--ice); color: var(--slate); padding: 2px 8px; border-radius: 4px; font-weight: 500; }

.summary-row { display: flex; justify-content: space-between; font-size: 12.5px; margin-bottom: 4px; }
.category-row { display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid var(--ice); }
.category-row:last-child { border-bottom: none; }
</style>
