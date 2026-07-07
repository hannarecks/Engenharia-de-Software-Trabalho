import { supabase } from './supabase'

export async function listAlertas(contratoId) {
  const { data, error } = await supabase
    .from('mod8_alerta')
    .select('*')
    .eq('id_contrato_m8', contratoId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}
