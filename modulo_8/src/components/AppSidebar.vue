<template>
  <aside class="sidebar">
    <div class="sidebar-brand">
      <div class="system-label">Sistema SaaS</div>
      <div class="system-name">LicitaSaaS</div>
      <div class="module-badge">
        <div class="badge-dot"></div>
        Módulo 8 — Contratos
      </div>
    </div>

    <div class="sidebar-section">Contrato Ativo</div>
    <nav class="sidebar-nav">
      <a :class="{ active: activeTab === 'overview' }" @click="$emit('change-tab', 'overview')">
        <span class="nav-icon"></span> Visão Geral
      </a>
      <a :class="{ active: activeTab === 'compare' }" @click="$emit('change-tab', 'compare')">
        <span class="nav-icon"></span> Comparação de Docs
        <span class="nav-badge amber">3</span>
      </a>
      <a :class="{ active: activeTab === 'divergencias' }" @click="$emit('change-tab', 'divergencias')">
        <span class="nav-icon"></span> Relatório de Divergências
        <span class="nav-badge">5</span>
      </a>
      <a :class="{ active: activeTab === 'pagamentos' }" @click="$emit('change-tab', 'pagamentos')">
        <span class="nav-icon"></span> Monitoramento Financeiro
      </a>
      <a :class="{ active: activeTab === 'alertas' }" @click="$emit('change-tab', 'alertas')">
        <span class="nav-icon"></span> Alertas
        <span class="nav-badge">2</span>
      </a>
      <a :class="{ active: activeTab === 'tarefas' }" @click="$emit('change-tab', 'tarefas')">
        <span class="nav-icon"></span> Gestão de Tarefas
      </a>
    </nav>

    <div class="sidebar-section">Sistema</div>
    <nav class="sidebar-nav">
      <a><span class="nav-icon"></span> Todos os Contratos</a>
      <a><span class="nav-icon"></span> Portal Transparência</a>
      <a><span class="nav-icon"></span> Relatórios</a>
      <a><span class="nav-icon"></span> Configurações</a>
    </nav>

    <div class="sidebar-footer">
      <div class="user-info">
        <div class="user-avatar">AM</div>
        <div>
          <div class="user-name">Ana Martins</div>
          <div class="user-role">Gestora de Contratos</div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'AppSidebar',
  props: {
    activeTab: {
      type: String,
      required: true,
    },
  },
}
</script>

<style scoped>
.sidebar {
  width: var(--sidebar-w);
  background: var(--navy);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow-y: auto;
  z-index: 100;
}

.sidebar-brand {
  padding: 18px 20px 14px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.sidebar-brand .system-label {
  font-size: 10px; font-weight: 600; letter-spacing: 0.12em;
  text-transform: uppercase; color: rgba(255,255,255,0.4); margin-bottom: 4px;
}
.sidebar-brand .system-name {
  font-size: 15px; font-weight: 700; color: #fff; letter-spacing: -0.01em;
}
.sidebar-brand .module-badge {
  display: inline-flex; align-items: center; gap: 5px; margin-top: 6px;
  background: var(--navy-lt); border-radius: 4px; padding: 2px 8px;
  font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.85);
}
.sidebar-brand .module-badge .badge-dot {
  width: 6px; height: 6px; border-radius: 50%; background: #34D399;
}

.sidebar-section {
  padding: 12px 12px 4px; font-size: 10px; font-weight: 600;
  letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.3);
}

.sidebar-nav { padding: 4px 8px; }
.sidebar-nav a {
  display: flex; align-items: center; gap: 10px; padding: 9px 12px;
  border-radius: 6px; color: rgba(255,255,255,0.65); font-size: 13.5px;
  font-weight: 500; text-decoration: none; cursor: pointer;
  transition: background 0.15s, color 0.15s; margin-bottom: 1px;
}
.sidebar-nav a:hover { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.9); }
.sidebar-nav a.active { background: rgba(255,255,255,0.12); color: #fff; }
.sidebar-nav a .nav-icon { font-size: 15px; width: 20px; text-align: center; flex-shrink: 0; }
.sidebar-nav a .nav-badge {
  margin-left: auto; background: #EF4444; color: #fff;
  font-size: 10px; font-weight: 700; padding: 1px 6px;
  border-radius: 10px; min-width: 18px; text-align: center;
}
.sidebar-nav a .nav-badge.amber { background: var(--amber); }

.sidebar-footer {
  margin-top: auto; padding: 14px 20px;
  border-top: 1px solid rgba(255,255,255,0.08);
}
.user-info { display: flex; align-items: center; gap: 10px; }
.user-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  background: var(--navy-lt); display: flex; align-items: center;
  justify-content: center; font-size: 13px; font-weight: 700;
  color: #fff; flex-shrink: 0;
}
.user-name { font-size: 12.5px; font-weight: 600; color: rgba(255,255,255,0.9); }
.user-role { font-size: 11px; color: rgba(255,255,255,0.4); }
</style>
