import { supabase } from './supabase'

export async function listDivergencias(contratoId) {
  const { data, error } = await supabase
    .from('mod8_divergencia')
    .select('*')
    .eq('id_contrato_m8', contratoId)
    .order('criticidade', { ascending: false })

  if (error) throw error
  return data
}

export async function marcarResolvida(divergenciaId) {
  const { data, error } = await supabase
    .from('mod8_divergencia')
    .update({ resolvida: true })
    .eq('id', divergenciaId)
    .select()
    .single()

  if (error) throw error
  return data
}