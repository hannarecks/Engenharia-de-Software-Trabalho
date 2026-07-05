<template>
  <div>
    <div class="page-header">
      <div>
        <div class="page-title">Pagamentos</div>
        <div class="page-subtitle">
          {{ paidCount }} pagas · {{ lateCount }} em atraso · {{ pendingCount }} pendentes · {{ upcomingCount }} a vencer
          <span v-if="ultimaSincronizacao"> · Última sincronização: {{ ultimaSincronizacao }}</span>
        </div>
      </div>
      <div class="flex-row">
        <button class="btn-secondary" @click="$router.push({ name: 'divergencias' })">🔍 Ver Divergências</button>
        <button class="btn-primary" :disabled="sincronizando" @click="sincronizarPortal">
          {{ sincronizando ? 'Sincronizando…' : '🔄 Sincronizar Portal' }}
        </button>
      </div>
    </div>
    <div v-if="sincronizacaoErro" class="sync-error">⚠ {{ sincronizacaoErro }}</div>

    <!-- Payment cycle (Empenho -> Nota Fiscal -> Liquidação -> Pagamento) -->
    <div class="panel" style="margin-bottom: 22px">
      <div class="panel-header">
        <div>
          <div class="panel-title">🔄 Ciclo de Pagamento</div>
          <div class="panel-subtitle">Cada etapa só pode ser concluída após a anterior</div>
        </div>
      </div>
      <div class="panel-body">
        <div class="cycle-steps">
          <div
            v-for="(step, index) in cicloPagamento"
            :key="step.id"
            class="cycle-step"
            :class="step.status"
          >
            <div class="cycle-circle">{{ step.status === 'done' ? '✓' : index + 1 }}</div>
            <div class="cycle-label">{{ step.label }}</div>
            <button
              v-if="step.status !== 'done'"
              class="btn-secondary cycle-btn"
              @click="concluirEtapa(index)"
            >
              Concluir
            </button>
            <span v-else class="badge green cycle-badge">Concluída</span>
          </div>
        </div>
        <div v-if="cicloErro" class="cycle-error">⚠ {{ cicloErro }}</div>
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
            <div class="panel-subtitle">Consultar por CNPJ ou nome do fornecedor</div>
          </div>
        </div>
        <div class="panel-body">
          <div class="portal-search-row">
            <select class="form-input portal-search-type" v-model="buscaTipo">
              <option value="cnpj">CNPJ</option>
              <option value="nome">Nome</option>
            </select>
            <input
              class="form-input"
              :placeholder="buscaTipo === 'cnpj' ? 'Somente números' : 'Nome do fornecedor'"
              v-model="buscaValor"
              @keyup.enter="consultarPortal"
            />
            <button class="btn-primary portal-search-btn" :disabled="buscaCarregando" @click="consultarPortal">
              {{ buscaCarregando ? 'Buscando…' : 'Buscar' }}
            </button>
          </div>

          <!-- Erro / indisponibilidade -->
          <div v-if="buscaErro" class="portal-alert error">
            <div>⚠ {{ buscaErro }}</div>
            <div class="portal-alert-hint">
              Você ainda pode atualizar as etapas do ciclo de pagamento manualmente enquanto o Portal está indisponível.
            </div>
          </div>

          <!-- Nenhum resultado -->
          <div v-else-if="buscaFeita && buscaSemResultado" class="portal-alert empty">
            Nenhum registro encontrado para o fornecedor informado. Revise o CNPJ ou tente buscar pelo nome.
          </div>

          <!-- Resultado da busca -->
          <div v-else-if="resultadosBusca.length" class="portal-results">
            <div v-for="fornecedor in resultadosBusca" :key="fornecedor.cnpj" class="portal-fornecedor">
              <div class="portal-fornecedor-nome">{{ fornecedor.nome }}</div>
              <div
                v-for="reg in fornecedor.registros"
                :key="reg.numero"
                class="portal-record-row"
              >
                <div>
                  <div class="portal-record-title">{{ reg.tipo }} — {{ reg.numero }}</div>
                  <div class="portal-record-date">{{ reg.data }}</div>
                </div>
                <div class="mono portal-record-value">{{ reg.valor }}</div>
              </div>
            </div>
          </div>

          <!-- Estado padrão: últimos registros conhecidos -->
          <template v-else>
            <div class="portal-default-label">Últimos registros cruzados</div>
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
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { payments, portalRecords, orcamento } from '@/data/mockData'
import { buscarPorCnpj, buscarPorNome, sincronizar } from '@/services/portalTransparencia'

export default {
  name: 'TabPagamentos',
  data() {
    return {
      filter: '',
      payments,
      portalRecords,
      orcamento,

      // Sincronização geral com o Portal
      sincronizando: false,
      sincronizacaoErro: '',
      ultimaSincronizacao: '',

      // Ciclo de pagamento (RF-6)
      cicloPagamento: [
        { id: 'empenho', label: 'Empenho', status: 'pending' },
        { id: 'notaFiscal', label: 'Nota Fiscal', status: 'pending' },
        { id: 'liquidacao', label: 'Liquidação', status: 'pending' },
        { id: 'pagamento', label: 'Pagamento', status: 'pending' },
      ],
      cicloErro: '',

      // Consulta ao Portal da Transparência (RF-6)
      buscaTipo: 'cnpj',
      buscaValor: '',
      buscaCarregando: false,
      buscaFeita: false,
      buscaErro: '',
      resultadosBusca: [],
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
    buscaSemResultado() {
      return this.resultadosBusca.length === 0
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

    // Regra de negócio: não deixa concluir uma etapa sem a anterior estar concluída (CT-20)
    concluirEtapa(index) {
      this.cicloErro = ''
      const etapaAnterior = this.cicloPagamento[index - 1]
      if (etapaAnterior && etapaAnterior.status !== 'done') {
        this.cicloErro = `Conclua a etapa "${etapaAnterior.label}" antes de avançar para "${this.cicloPagamento[index].label}".`
        return
      }
      this.cicloPagamento[index].status = 'done'
    },

    // Sincronização geral do Portal (botão do cabeçalho)
    async sincronizarPortal() {
      this.sincronizando = true
      this.sincronizacaoErro = ''
      try {
        const registrosAtualizados = await sincronizar()
        this.portalRecords.splice(0, this.portalRecords.length, ...registrosAtualizados)
        const agora = new Date()
        this.ultimaSincronizacao = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      } catch (erro) {
        this.sincronizacaoErro = erro.message
      } finally {
        this.sincronizando = false
      }
    },

    // Consulta ao Portal da Transparência, por CNPJ ou por nome (CT-16 a CT-19)
    async consultarPortal() {
      if (!this.buscaValor.trim()) return

      this.buscaCarregando = true
      this.buscaErro = ''
      this.buscaFeita = false
      this.resultadosBusca = []

      try {
        if (this.buscaTipo === 'cnpj') {
          const resultado = await buscarPorCnpj(this.buscaValor)
          this.resultadosBusca = resultado ? [resultado] : []
        } else {
          this.resultadosBusca = await buscarPorNome(this.buscaValor)
        }
        this.buscaFeita = true
      } catch (erro) {
        this.buscaErro = erro.message
      } finally {
        this.buscaCarregando = false
      }
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

.sync-error {
  margin-bottom: 16px; padding: 10px 14px; border-radius: 7px;
  background: #FFF5F5; border: 1px solid #FCA5A5; color: var(--red);
  font-size: 12.5px; font-weight: 500;
}

/* Ciclo de pagamento */
.cycle-steps { display: flex; align-items: flex-start; }
.cycle-step {
  display: flex; flex-direction: column; align-items: center;
  position: relative; flex: 1; gap: 8px;
}
.cycle-step:not(:last-child)::after {
  content: ''; position: absolute; top: 16px; left: 50%; width: 100%;
  height: 2px; z-index: 0; background: var(--ice-mid);
}
.cycle-step.done:not(:last-child)::after { background: var(--emerald); }

.cycle-circle {
  width: 32px; height: 32px; border-radius: 50%;
  border: 2px solid var(--ice-mid); background: var(--white);
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 600; z-index: 1; position: relative;
}
.cycle-step.done .cycle-circle { border-color: var(--emerald); background: var(--emerald); color: #fff; }

.cycle-label { font-size: 12px; font-weight: 600; color: var(--text-b); text-align: center; }
.cycle-btn { font-size: 11.5px; padding: 4px 10px; }
.cycle-badge { font-size: 11px; }
.cycle-error {
  margin-top: 14px; padding: 10px 12px; border-radius: 7px;
  background: #FFF5F5; border: 1px solid #FCA5A5; color: var(--red);
  font-size: 12.5px; font-weight: 500;
}

/* Busca no Portal */
.portal-search-row { display: flex; gap: 6px; margin-bottom: 14px; }
.portal-search-type { width: 90px; flex-shrink: 0; }
.portal-search-btn { font-size: 12px; padding: 8px 12px; flex-shrink: 0; white-space: nowrap; }

.portal-alert {
  padding: 10px 12px; border-radius: 7px; font-size: 12.5px; font-weight: 500;
}
.portal-alert.error { background: #FFF5F5; border: 1px solid #FCA5A5; color: var(--red); }
.portal-alert.empty { background: var(--ice); color: var(--text-m); font-weight: 400; }
.portal-alert-hint { margin-top: 6px; font-weight: 400; color: var(--text-m); }

.portal-default-label { font-size: 11.5px; font-weight: 600; color: var(--text-m); text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 6px; }
.portal-fornecedor-nome { font-size: 13px; font-weight: 700; color: var(--text-h); margin-bottom: 6px; }
</style>