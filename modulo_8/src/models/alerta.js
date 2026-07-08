function formatDataHora(dataIso) {
  if (!dataIso) return '—'
  return new Date(dataIso).toLocaleString('pt-BR')
}

const TIPO_POR_STATUS_ENVIO = {
  falha: 'critical',
  pendente: 'warning',
  enviado: 'info',
}

const ICONE_POR_TIPO = {
  critical: '⚠️',
  warning: '🔔',
  info: 'ℹ️',
}

export function formatAlerta(row) {
  const type = TIPO_POR_STATUS_ENVIO[row.status_envio] || 'info'

  return {
    id: row.id,
    type,
    icon: ICONE_POR_TIPO[type],
    title: row.tipo || 'Alerta de contrato',
    body: row.data_vencimento
      ? `Vencimento em ${new Date(row.data_vencimento).toLocaleDateString('pt-BR')}.`
      : 'Sem data de vencimento associada.',
    time: formatDataHora(row.created_at),
  }
}
