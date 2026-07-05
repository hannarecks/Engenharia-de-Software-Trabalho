<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-box">
      <div class="modal-header">
        <div class="modal-title">Nova Tarefa</div>
        <button class="modal-close" @click="$emit('close')">✕</button>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>Descrição</label>
          <textarea
            v-model="text"
            rows="3"
            placeholder="Ex: Enviar medição do 5º período"
            required
          ></textarea>
        </div>

        <div class="form-group">
          <label>Prioridade</label>
          <select v-model="priority">
            <option value="high">Alta</option>
            <option value="medium">Média</option>
            <option value="low">Baixa</option>
          </select>
        </div>

        <div class="form-group">
          <label>Prazo</label>
          <input type="text" v-model="due" placeholder="Ex: 30/06/2025" required />
        </div>

        <div class="modal-actions">
          <button type="button" class="btn-secondary" @click="$emit('close')">Cancelar</button>
          <button type="submit" class="btn-primary">Criar Tarefa</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NewTaskModal',
  data() {
    return {
      text: '',
      priority: 'medium',
      due: '',
    }
  },
  methods: {
    handleSubmit() {
      this.$emit('add-task', {
        id: Date.now(),
        text: this.text,
        priority: this.priority,
        due: this.due,
        overdue: false,
        done: false,
      })
      this.text = ''
      this.priority = 'medium'
      this.due = ''
    },
  },
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-box {
  background: var(--white);
  border-radius: 10px;
  padding: 22px;
  width: 420px;
  max-width: 90vw;
  box-shadow: var(--shadow);
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.modal-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-h);
}
.modal-close {
  border: none;
  background: none;
  cursor: pointer;
  font-size: 16px;
  color: var(--text-m);
}
.form-group {
  margin-bottom: 14px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.form-group label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-m);
}
.form-group textarea,
.form-group select,
.form-group input {
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px 10px;
  font-size: 13px;
  font-family: inherit;
  color: var(--text-h);
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 18px;
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
.btn-secondary {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-m);
  cursor: pointer;
}
</style>
