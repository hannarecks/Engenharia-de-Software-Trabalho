<template>
  <div>
    <div class="page-header">
      <div>
        <div class="page-title">Alertas</div>
        <div class="page-subtitle">Central de notificações e configuração de alertas do contrato</div>
      </div>
    </div>

    <!-- Filtro por tipo -->
    <div class="filter-bar">
      <button
        v-for="f in filters"
        :key="f.value"
        class="filter-btn"
        :class="{ active: activeFilter === f.value }"
        @click="activeFilter = f.value"
      >
        {{ f.label }} <span class="filter-count">{{ countByType(f.value) }}</span>
      </button>
    </div>

    <div class="two-col">
      <!-- Lista completa de alertas -->
      <div class="panel">
        <div class="panel-header">
          <div>
            <div class="panel-title">🔔 Todos os Alertas</div>
            <div class="panel-subtitle">{{ filteredAlerts.length }} alerta(s)</div>
          </div>
        </div>
        <div class="panel-body">
          <div v-if="filteredAlerts.length === 0" class="empty-state">
            Nenhum alerta para este filtro.
          </div>
          <div
            v-for="alert in filteredAlerts"
            :key="alert.id"
            class="alert-item"
            :class="alert.type"
          >
            <div class="alert-icon">{{ alert.icon || defaultIcon(alert.type) }}</div>
            <div class="alert-content">
              <div class="alert-title">{{ alert.title }}</div>
              <div class="alert-body">{{ alert.body }}</div>
              <div class="alert-time">{{ alert.time }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Painel de configuração -->
      <div class="panel">
        <div class="panel-header">
          <div>
            <div class="panel-title">⚙️ Configuração</div>
            <div class="panel-subtitle">Ligue ou desligue cada tipo de alerta</div>
          </div>
        </div>
        <div class="panel-body">
          <div v-for="cfg in config" :key="cfg.id" class="config-item">
            <div class="config-text">
              <div class="config-name">{{ cfg.name }}</div>
              <div class="config-desc">{{ cfg.desc }}</div>
            </div>
            <label class="toggle">
              <input type="checkbox" v-model="cfg.active" />
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { alerts, alertConfig } from '@/data/mockData'

// Liga cada alerta (por id) à configuração correspondente.
// Alertas que não aparecem aqui não são afetados por nenhum toggle.
const alertConfigMap = {
  1: 1, // Pagamento vencido há 28 dias -> Pagamento vencido
  2: 3, // Divergência crítica sem resolução -> Nova divergência
  3: 2, // Vencimento de parcela em 7 dias -> Aviso pré-vencimento
  6: 4, // Sincronização concluída -> Sincronização Portal
  7: 5, // E-mail enviado ao órgão -> Notificar por e-mail
}

export default {
  name: 'TabAlertas',
  data() {
    return {
      alerts,
      config: alertConfig,
      activeFilter: 'all',
      filters: [
        { label: 'Todos', value: 'all' },
        { label: 'Críticos', value: 'critical' },
        { label: 'Avisos', value: 'warning' },
        { label: 'Informativos', value: 'info' },
      ],
    }
  },
  computed: {
    filteredAlerts() {
      return this.alerts
        .filter(a => this.activeFilter === 'all' || a.type === this.activeFilter)
        .filter(a => this.isAlertEnabled(a))
    },
  },
  methods: {
    isAlertEnabled(alert) {
      const configId = alertConfigMap[alert.id]
      if (!configId) return true // alerta sem vínculo: sempre visível
      const cfg = this.config.find(c => c.id === configId)
      return cfg ? cfg.active : true
    },
    countByType(type) {
      const base = type === 'all' ? this.alerts : this.alerts.filter(a => a.type === type)
      return base.filter(a => this.isAlertEnabled(a)).length
    },
    defaultIcon(type) {
      const icons = { critical: '⚠️', warning: '🔔', info: 'ℹ️' }
      return icons[type] || '🔔'
    },
  },
}
</script>

<style scoped>
.filter-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 18px;
}
.filter-btn {
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid var(--border);
  background: var(--white);
  color: var(--text-m);
  font-size: 12.5px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}
.filter-btn:hover {
  border-color: var(--blue-acc);
  color: var(--blue-acc);
}
.filter-btn.active {
  background: var(--navy);
  border-color: var(--navy);
  color: #fff;
}
.filter-count {
  opacity: 0.7;
  margin-left: 4px;
}

.empty-state {
  text-align: center;
  padding: 24px 0;
  color: var(--text-m);
  font-size: 13px;
}

.config-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
}
.config-item:last-child {
  border-bottom: none;
}
.config-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-h);
}
.config-desc {
  font-size: 11.5px;
  color: var(--text-m);
  margin-top: 2px;
}

/* toggle switch */
.toggle {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 22px;
  flex-shrink: 0;
}
.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}
.toggle-slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background-color: var(--ice-mid);
  border-radius: 22px;
  transition: 0.2s;
}
.toggle-slider::before {
  content: "";
  position: absolute;
  height: 16px;
  width: 16px;
  left: 3px;
  bottom: 3px;
  background-color: #fff;
  border-radius: 50%;
  transition: 0.2s;
}
.toggle input:checked + .toggle-slider {
  background-color: var(--emerald);
}
.toggle input:checked + .toggle-slider::before {
  transform: translateX(18px);
}
</style>
