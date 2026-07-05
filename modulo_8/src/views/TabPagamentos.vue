<template>
  <div>
    <div class="page-header">
      <div>
        <div class="page-title">Pagamentos</div>
        <div class="page-subtitle">
          {{ paidCount }} pagas · {{ lateCount }} em atraso · {{ pendingCount }} pendentes · {{ upcomingCount }} a vencer
        </div>
      </div>
      <div class="flex-row">
        <button class="btn-secondary" @click="$router.push({ name: 'divergencias' })">🔍 Ver Divergências</button>
        <button class="btn-primary">🔄 Sincronizar Portal</button>
      </div>
    </div>

    <!-- Budget execution -->
    <div class="panel" style="margin-bottom: 22px">
      <div class="panel-header">
        <div>
          <div class="panel-title">💰 Execução Orçamentária</div>
          <div class="panel-subtitle">Empenhado, liquidado e pago sobre o valor total do contrato</div>
        </div>
      </div>
      <div class="panel-body">
        <div v-for="item in orcamento" :key="item.label" style="margin-bottom: 16px">
          <div class="summary-row">
            <span style="font-weight: 600; color: var(--text-b)">{{ item.label }}</span>
            <span class="mono">{{ item.value }}</span>
          </div>
          <div class="progress-bar-wrap">
            <div class="progress-bar-fill" :style="{ width: item.pct + '%', background: item.color }"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="three-col">
      <!-- Payments list -->
      <div class="panel">
        <div class="panel-header">
          <div>
            <div class="panel-title">Parcelas de Pagamento</div>
            <div class="panel-subtitle">Ordenadas pela sequência do contrato</div>
          </div>
          <select class="form-input" style="font-size: 12px; padding: 4px 8px; width: auto" v-model="filter">
            <option value="">Todas</option>
            <option value="paid">Pagas</option>
            <option value="late">Atrasadas</option>
            <option value="pending">Pendentes</option>
            <option value="upcoming">A vencer</option>
          </select>
        </div>
        <div class="panel-body">
          <div
            v-for="payment in filteredPayments"
            :key="payment.id"
            class="payment-item"
          >
            <div class="payment-status-bar" :class="payment.status"></div>
            <div style="flex: 1">
              <div class="payment-top-row">
                <div class="payment-title">{{ payment.title }}</div>
                <span class="badge" :class="statusBadgeClass(payment.status)">
                  {{ statusLabel(payment.status) }}
                </span>
              </div>
              <div class="payment-date">{{ payment.date }}</div>
              <div v-if="payment.note" class="payment-note">{{ payment.note }}</div>
            </div>
            <div class="payment-amount mono">{{ payment.amount }}</div>
          </div>

          <div v-if="filteredPayments.length === 0" class="empty-state">
            Nenhuma parcela encontrada com o status selecionado.
          </div>
        </div>
      </div>

      <!-- Portal da Transparência sidebar -->
      <div class="panel">
        <div class="panel-header">
          <div>
            <div class="panel-title">🏛️ Portal da Transparência</div>
            <div class="panel-subtitle">Últimos registros cruzados</div>
          </div>
        </div>
        <div class="panel-body">
          <div
            v-for="record in portalRecords"
            :key="record.id"
            class="portal-record-row"
          >
            <div>
              <div class="portal-record-title">{{ record.title }}</div>
              <div class="portal-record-date">{{ record.date }}</div>
            </div>
            <div class="mono portal-record-value">{{ record.value }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { payments, portalRecords, orcamento } from '@/data/mockData'

export default {
  name: 'TabPagamentos',
  data() {
    return {
      filter: '',
      payments,
      portalRecords,
      orcamento,
    }
  },
  computed: {
    filteredPayments() {
      if (!this.filter) return this.payments
      return this.payments.filter(p => p.status === this.filter)
    },
    paidCount() {
      return this.payments.filter(p => p.status === 'paid').length
    },
    lateCount() {
      return this.payments.filter(p => p.status === 'late').length
    },
    pendingCount() {
      return this.payments.filter(p => p.status === 'pending').length
    },
    upcomingCount() {
      return this.payments.filter(p => p.status === 'upcoming').length
    },
  },
  methods: {
    statusLabel(status) {
      return {
        paid: 'Pago',
        late: 'Atrasado',
        pending: 'Pendente',
        upcoming: 'A vencer',
      }[status]
    },
    statusBadgeClass(status) {
      return {
        paid: 'green',
        late: 'red',
        pending: 'amber',
        upcoming: 'blue',
      }[status]
    },
  },
}
</script>

<style scoped>
.payment-item {
  display: flex; gap: 14px; padding: 14px 0; align-items: flex-start;
  border-bottom: 1px solid var(--ice-mid);
}
.payment-item:last-child { border-bottom: none; }

.payment-status-bar { width: 4px; border-radius: 2px; flex-shrink: 0; align-self: stretch; }
.payment-status-bar.paid     { background: var(--emerald); }
.payment-status-bar.late     { background: #EF4444; }
.payment-status-bar.pending  { background: var(--amber); }
.payment-status-bar.upcoming { background: var(--blue-acc); }

.payment-top-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 3px; }
.payment-title { font-size: 13.5px; font-weight: 600; color: var(--text-h); }
.payment-date  { font-size: 12.5px; color: var(--text-m); }
.payment-note  { font-size: 12px; color: var(--amber); margin-top: 4px; font-weight: 500; }
.payment-amount { font-size: 13.5px; font-weight: 700; color: var(--text-h); white-space: nowrap; }

.summary-row { display: flex; justify-content: space-between; font-size: 12.5px; margin-bottom: 6px; }

.portal-record-row {
  display: flex; justify-content: space-between; align-items: flex-start;
  padding: 10px 0; border-bottom: 1px solid var(--ice);
  gap: 10px;
}
.portal-record-row:last-child { border-bottom: none; }
.portal-record-title { font-size: 12.5px; font-weight: 600; color: var(--text-b); }
.portal-record-date  { font-size: 11.5px; color: var(--text-m); margin-top: 2px; }
.portal-record-value { font-size: 12.5px; color: var(--text-h); white-space: nowrap; }

.empty-state {
  text-align: center; padding: 24px 0; color: var(--text-m); font-size: 13px;
}
</style>