// Serviço de integração com o Portal da Transparência.
//
// IMPORTANTE: o projeto é sobre o Município de Santa Cruz do Sul (RS).
// O Portal da Transparência da cidade roda em
// https://grp.santacruz.rs.gov.br/transparencia/portal/ — um módulo
// público dentro do sistema de gestão municipal (GRP). Até o momento
// desta pesquisa, não foi encontrada documentação de API pública/REST
// para esse portal (diferente do Portal da Transparência Federal, que
// tem API documentada). O site também é renderizado via JavaScript
// (SPA), o que dificulta até um scraping simples.
//
// Por isso, este serviço hoje SIMULA as respostas (mock), mas com a
// mesma "forma" que uma chamada real teria (funções async, podem
// falhar, retornam os mesmos campos). Se o grupo confirmar uma fonte
// de dados real (endpoint interno, planilha de dados abertos, ou
// contato direto com a Prefeitura para acesso a dados), troque só o
// conteúdo das funções abaixo — quem usa este serviço (TabPagamentos)
// não precisa mudar nada.

// Flag para simular indisponibilidade do Portal (usada no teste CT-19).
// Pode ser ligada/desligada manualmente durante os testes.
export let simularIndisponibilidade = false

export function setSimularIndisponibilidade(valor) {
  simularIndisponibilidade = valor
}

// Base de dados mockada, simulando o retorno do Portal da Transparência.
const registrosMock = [
  {
    cnpj: '00000000000100',
    nome: 'Fornecedor Exemplo LTDA',
    registros: [
      { tipo: 'Empenho', numero: 'EMP-0047', data: '01/12/2024', valor: 'R$ 1.243.750,00' },
      { tipo: 'Liquidação', numero: 'LIQ-0012', data: '14/02/2025', valor: 'R$ 155.250,00' },
      { tipo: 'Pagamento', numero: 'PAG-0012', data: '15/02/2025', valor: 'R$ 155.250,00' },
    ],
  },
]

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Busca por CNPJ do fornecedor (fluxo principal — CT-16)
export async function buscarPorCnpj(cnpj) {
  await delay(700)

  if (simularIndisponibilidade) {
    throw new Error('Não foi possível acessar o Portal da Transparência. Tente novamente mais tarde.')
  }

  const cnpjLimpo = (cnpj || '').replace(/\D/g, '')
  const encontrado = registrosMock.find((f) => f.cnpj === cnpjLimpo)
  return encontrado || null // null = nenhum resultado encontrado (CT-18)
}

// Busca alternativa por nome do fornecedor (fluxo alternativo — CT-17)
export async function buscarPorNome(nome) {
  await delay(700)

  if (simularIndisponibilidade) {
    throw new Error('Não foi possível acessar o Portal da Transparência. Tente novamente mais tarde.')
  }

  const termo = (nome || '').trim().toLowerCase()
  if (!termo) return []
  return registrosMock.filter((f) => f.nome.toLowerCase().includes(termo))
}