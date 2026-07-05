// Converte a linha crua de mod8_contrato no formato usado pela UI.

function formatMoeda(valor) {
  if (valor == null) return '—'
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
}

function formatData(dataIso) {
  if (!dataIso) return '—'
  return new Date(dataIso).toLocaleDateString('pt-BR')
}

export function formatContrato(row) {
  return {
    id: row.id,
    contratante: row.contratante ?? 'Não localizado',
    objeto: row.objeto ?? 'Não localizado',
    vigenciaInicio: formatData(row.vigencia_inicio),
    vigenciaFim: formatData(row.vigencia_fim),
    reajuste: row.reajuste ?? 'Não localizado',
    equilibrioFinanceiro: row.equilibrio_financeiro ?? 'Não localizado',
    preco: formatMoeda(row.preco),
    formaPagamento: row.forma_pagamento ?? 'Não localizado',
    prazoExecucao: row.prazo_execucao ?? 'Não localizado',
    prazoEntrega: row.prazo_entrega ?? 'Não localizado',
    obrigacoes: row.obrigacoes ?? 'Não localizado',
    gestor: row.gestor_contrato ?? 'Não localizado',
    status: row.status,
    camposEditados: row.campos_editados_manualmente ?? {},
  }
}
