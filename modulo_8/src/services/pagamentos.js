import { supabase } from './supabase'

export async function listPagamentos(contratoId) {
  const { data, error } = await supabase
    .from('mod8_pagamento')
    .select('*')
    .eq('id_contrato_m8', contratoId)
    .order('ordem', { ascending: true })

  if (error) throw error
  return data
}

// Tenta marcar uma etapa como concluída. Se o trigger
// mod8_valida_sequencia_pagamento() bloquear (etapa anterior ainda
// pendente), o Supabase devolve o erro do RAISE EXCEPTION aqui.
export async function concluirEtapaPagamento(pagamentoId) {
  const { data, error } = await supabase
    .from('mod8_pagamento')
    .update({ status: 'concluida' })
    .eq('id', pagamentoId)
    .select()
    .single()

  if (error) throw traduzirErroPagamento(error)
  return data
}

// error.code === 'P0001' é o código padrão do Postgres para qualquer
// RAISE EXCEPTION sem SQLSTATE customizado — é como diferenciamos
// "regra de negócio violada" (mostra a mensagem) de um erro de
// rede/RLS de verdade (mostra mensagem genérica, loga o real).
function traduzirErroPagamento(error) {
  if (error.code === 'P0001') {
    return new Error(error.message)
  }
  console.error('Erro inesperado ao atualizar pagamento:', error)
  return new Error('Não foi possível atualizar o pagamento. Tente novamente.')
}