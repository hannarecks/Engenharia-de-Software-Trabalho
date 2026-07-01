<template>
  <div class="topbar">
    <div class="topbar-breadcrumb">
      <span>LicitaSaaS</span>
      <span class="topbar-sep">›</span>
      <span>Módulo 8</span>
      <span class="topbar-sep">›</span>
      <span class="crumb-active">{{ tabTitles[activeTab] }}</span>
    </div>

    <div class="topbar-contract-selector">
      📄 Contrato: <span class="contract-id">CTR-2024-0047</span>
      <span style="color: var(--text-m)">▾</span>
    </div>

    <div class="topbar-actions">
      <div class="btn-icon" title="Exportar relatório">📤</div>
      <div class="btn-icon" title="Notificações" @click="$emit('change-tab', 'alertas')">
        🔔
        <div class="notif-dot"></div>
      </div>
      <div class="btn-icon" title="Ajuda">❓</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppTopbar',
  props: {
    activeTab: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      tabTitles: {
        overview:     'Visão Geral',
        compare:      'Comparação de Documentos',
        divergencias: 'Relatório de Divergências',
        pagamentos:   'Monitoramento Financeiro',
        alertas:      'Central de Alertas',
        tarefas:      'Gestão de Tarefas',
      },
    }
  },
}
</script>

<style scoped>
.topbar {
  height: var(--topbar-h);
  background: var(--white);
  border-bottom: 1px solid var(--border);
  display: flex; align-items: center; padding: 0 24px; gap: 16px;
  flex-shrink: 0; box-shadow: var(--shadow);
}

.topbar-breadcrumb {
  display: flex; align-items: center; gap: 6px;
  font-size: 13px; color: var(--text-m);
}
.topbar-breadcrumb .crumb-active { color: var(--text-h); font-weight: 600; }
.topbar-sep { color: var(--border); }

.topbar-contract-selector {
  margin-left: 20px; display: flex; align-items: center; gap: 8px;
  background: var(--ice); border: 1px solid var(--border); border-radius: 6px;
  padding: 5px 10px; cursor: pointer; font-size: 12.5px;
  color: var(--text-b); font-weight: 500;
}
.topbar-contract-selector .contract-id {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px; color: var(--blue-acc); font-weight: 600;
}

.topbar-actions { margin-left: auto; display: flex; align-items: center; gap: 10px; }

.btn-icon {
  width: 34px; height: 34px; border-radius: 6px;
  border: 1px solid var(--border); background: var(--white);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; font-size: 15px; position: relative;
  transition: background 0.15s;
}
.btn-icon:hover { background: var(--ice); }
.btn-icon .notif-dot {
  position: absolute; top: 4px; right: 4px;
  width: 7px; height: 7px; border-radius: 50%;
  background: #EF4444; border: 1.5px solid #fff;
}
</style>
