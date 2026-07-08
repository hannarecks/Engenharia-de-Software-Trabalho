const CRITICIDADE_INFO = {
  critica: { sev: 'high', label: 'Crítica' },
  alta: { sev: 'high', label: 'Alta' },
  media: { sev: 'medium', label: 'Média' },
  baixa: { sev: 'low', label: 'Baixa' },
}

export function formatDivergencia(row) {
  const info = CRITICIDADE_INFO[row.criticidade] || CRITICIDADE_INFO.media

  return {
    id: row.id,
    sev: info.sev,
    severidadeLabel: info.label,
    campo: row.campo,
    title: `Divergência no campo "${row.campo}"`,
    desc: row.valor_esperado
      ? `Informado: ${row.valor_informado ?? '—'} · Esperado: ${row.valor_esperado}`
      : (row.valor_informado || 'Sem detalhes adicionais.'),
    resolvida: row.resolvida,
    status: row.resolvida ? 'Resolvida' : 'Aberta',
    statusClass: row.resolvida ? 'green' : (info.sev === 'high' ? 'red' : 'amber'),
  }
}
