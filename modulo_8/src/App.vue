<template>
  <div id="app-root">
    <app-sidebar :active-tab="activeTab" @change-tab="changeTab" />

    <div class="main">

      <div class="content">
        <tab-overview
          v-if="activeTab === 'overview'"
          @change-tab="changeTab"
          @open-modal="openModal = true"
        />
        <tab-compare
          v-if="activeTab === 'compare'"
          @change-tab="changeTab"
        />
        <tab-divergencias
          v-if="activeTab === 'divergencias'"
        />
        <tab-pagamentos
          v-if="activeTab === 'pagamentos'"
        />
        <tab-alertas
          v-if="activeTab === 'alertas'"
        />
        <tab-tarefas
          v-if="activeTab === 'tarefas'"
          :tasks="tasks"
          @open-modal="openModal = true"
        />
      </div>
    </div>

    <new-task-modal
      v-if="openModal"
      @close="openModal = false"
      @add-task="addTask"
    />
  </div>
</template>

<script>
import AppSidebar   from '@/components/AppSidebar.vue'
import NewTaskModal from '@/components/NewTaskModal.vue'
import TabOverview    from '@/views/TabOverview.vue'
import TabDivergencias from '@/views/TabDivergencias.vue'

import { initialTasks } from '@/data/mockData'

export default {
  name: 'App',
  components: {
    AppSidebar,
    NewTaskModal,
    TabOverview,
    TabDivergencias,
  },
  data() {
    return {
      activeTab: 'overview',
      openModal: false,
      // Deep clone so task checkboxes are reactive
      tasks: initialTasks.map(t => ({ ...t })),
    }
  },
  methods: {
    changeTab(tab) {
      this.activeTab = tab
    },
    addTask(task) {
      this.tasks.push(task)
      this.openModal = false
      this.activeTab = 'tarefas'
    },
  },
}
</script>

<style>
/* Import global styles */
@import '@/assets/styles.css';
</style>

<style scoped>
#app-root {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}
</style>
