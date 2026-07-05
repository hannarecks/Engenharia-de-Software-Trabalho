import { supabase } from './supabase'

export async function listContratos() {
  const { data, error } = await supabase
    .from('mod8_contrato')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getContrato(id) {
  const { data, error } = await supabase
    .from('mod8_contrato')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function updateContrato(id, campos) {
  const { data, error } = await supabase
    .from('mod8_contrato')
    .update(campos)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function createContrato(campos) {
  const { data, error } = await supabase
    .from('mod8_contrato')
    .insert(campos)
    .select()
    .single()

  if (error) throw error
  return data
}