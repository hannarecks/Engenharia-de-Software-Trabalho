import { supabase } from './supabase'

export async function listDocumentos(contratoId) {
  const { data, error } = await supabase
    .from('mod8_documento')
    .select('*')
    .eq('id_contrato_m8', contratoId)
    .order('uploaded_at', { ascending: false })

  if (error) throw error
  return data
}

export async function createDocumento(campos) {
  const { data, error } = await supabase
    .from('mod8_documento')
    .insert(campos)
    .select()
    .single()

  if (error) throw error
  return data
}
