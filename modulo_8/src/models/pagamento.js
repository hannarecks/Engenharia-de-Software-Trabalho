const LABEL_POR_ETAPA = {
  empenho: 'Empenho',
  nota_fiscal: 'Nota Fiscal',
  liquidacao: 'Liquidação',
  pagamento: 'Pagamento',
}

export function formatCicloPagamento(rows) {
  return [...(rows || [])]
    .sort((a, b) => a.ordem - b.ordem)
    .map((row) => ({
      id: row.id,
      etapa: row.etapa,
      label: LABEL_POR_ETAPA[row.etapa] || row.etapa,
      status: row.status === 'concluida' ? 'done' : 'pending',
    }))
}
