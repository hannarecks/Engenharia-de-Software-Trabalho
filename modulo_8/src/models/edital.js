// Converte a linha crua de mod1_editais no formato usado pela tela
// TabOverview.vue (que antes vinha de um array mockado no componente).

export function formatEdital(row) {
  return {
    id: row.id,
    nome: row.nome,
    modalidade: row.modalidade,
    cidade: row.cidade,
    data_abertura: row.data_abertura,
    data_fechamento: row.data_fechamento,
    status: row.status,
    descricao: row.descricao,
    cnpj: row.cnpj,
    pncpId: row.pncp_id,
    arquivo_path: row.arquivo_path,
  };
}
