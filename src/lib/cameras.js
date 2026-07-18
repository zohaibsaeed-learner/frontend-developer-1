import { supabase } from './supabase'

export async function getCameras() {
  const { data, error } = await supabase
    .from('cameras')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getCameraById(id) {
  const { data, error } = await supabase
    .from('cameras')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function addCamera({ ownerId, name, rtspUrl, latitude, longitude }) {
  const { data, error } = await supabase
    .from('cameras')
    .insert({ owner_id: ownerId, name, rtsp_url: rtspUrl, latitude, longitude })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateCamera(id, updates) {
  const { data, error } = await supabase
    .from('cameras')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteCamera(id) {
  const { error } = await supabase.from('cameras').delete().eq('id', id)
  if (error) throw error
}