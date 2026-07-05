<template>
  <div>
    <div class="page-header">
      <div>
        <div class="page-title">Tarefas</div>
        <div class="page-subtitle">Pendências e ações de acompanhamento do contrato</div>
      </div>
      <button class="btn-primary" @click="showModal = true">+ Nova Tarefa</button>
    </div>

    <div class="panel">
      <div class="panel-header">
        <div>
          <div class="panel-title">✅ Lista de Tarefas</div>
          <div class="panel-subtitle">{{ pendingCount }} pendente(s) de {{ tasks.length }}</div>
        </div>
      </div>
      <div class="panel-body">
        <div v-if="tasks.length === 0" class="empty-state">
          Nenhuma tarefa cadastrada.
        </div>
        <div
          v-for="task in tasks"
          :key="task.id"
          class="task-item"
          :class="{ done: task.done }"
        >
          <input type="checkbox" v-model="task.done" class="task-checkbox" />
          <div class="task-content">
            <div class="task-text">{{ task.text }}</div>
            <div class="task-meta">
              <span class="badge" :class="priorityClass(task.priority)">
                {{ priorityLabel(task.priority) }}
              </span>
              <span class="task-due" :class="{ overdue: task.overdue && !task.done }">
                {{ task.overdue && !task.done ? '⚠ ' : '' }}{{ task.due }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <NewTaskModal
      v-if="showModal"
      @close="showModal = false"
      @add-task="handleAddTask"
    />
  </div>
</template>

<script>
import { initialTasks } from '@/data/mockData'
import NewTaskModal from '@/components/NewTaskModal.vue'

export default {
  name: 'TabTarefas',
  components: { NewTaskModal },
  data() {
    return {
      tasks: initialTasks,
      showModal: false,
    }
  },
  computed: {
    pendingCount() {
      return this.tasks.filter(t => !t.done).length
    },
  },
  methods: {
    handleAddTask(newTask) {
      this.tasks.push(newTask)
      this.showModal = false
    },
    priorityLabel(priority) {
      const labels = { high: 'Alta', medium: 'Média', low: 'Baixa' }
      return labels[priority] || priority
    },
    priorityClass(priority) {
      const classes = { high: 'red', medium: 'amber', low: 'blue' }
      return classes[priority] || 'gray'
    },
  },
}
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.btn-primary {
  background: var(--navy);
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}
.empty-state {
  text-align: center;
  padding: 24px 0;
  color: var(--text-m);
  font-size: 13px;
}
.task-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
}
.task-item:last-child {
  border-bottom: none;
}
.task-checkbox {
  margin-top: 3px;
  width: 16px;
  height: 16px;
  cursor: pointer;
}
.task-content {
  flex: 1;
}
.task-text {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-h);
}
.task-item.done .task-text {
  text-decoration: line-through;
  color: var(--text-m);
}
.task-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 5px;
}
.task-due {
  font-size: 11.5px;
  color: var(--text-m);
}
.task-due.overdue {
  color: var(--red, #ef4444);
  font-weight: 600;
}
</style>
