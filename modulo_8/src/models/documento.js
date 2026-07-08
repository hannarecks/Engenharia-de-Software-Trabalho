const TIPO_LABEL = {
  contrato_enviado: 'Contrato Enviado',
  minuta_edital: 'Minuta / Edital',
  anexo: 'Anexo',
}

function formatData(dataIso) {
  if (!dataIso) return '—'
  return new Date(dataIso).toLocaleDateString('pt-BR')
}

export function formatDocumento(row) {
  return {
    id: row.id,
    name: row.arquivo_nome || 'Documento sem nome',
    type: TIPO_LABEL[row.tipo] || row.tipo,
    date: formatData(row.uploaded_at),
    url: row.arquivo_url,
  }
}
