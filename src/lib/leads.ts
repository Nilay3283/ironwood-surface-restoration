import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export interface Lead {
  full_name: string;
  phone: string;
  email: string;
  service: string;
  surface_type: string;
  property_type: 'Residential' | 'Commercial';
  location: string;
  description: string;
}

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
const notifyFn = import.meta.env.VITE_NOTIFY_FUNCTION;

export const supabase: SupabaseClient | null = url && key ? createClient(url, key) : null;
export const leadsConfigured = !!supabase;

/**
 * Stores the inquiry in Supabase (table `estimate_requests`, bucket `project-photos`)
 * and triggers the optional notification Edge Function.
 * Without configuration it resolves after logging, so the UI can be developed offline.
 */
export async function submitLead(lead: Lead, photos: File[]): Promise<void> {
  if (!supabase) {
    console.info('[Ironwood] Supabase not configured — lead not stored.', lead, photos.map((p) => p.name));
    await new Promise((r) => setTimeout(r, 900));
    return;
  }
  const folder = crypto.randomUUID();
  const photo_paths: string[] = [];
  for (const f of photos) {
    const safe = f.name.replace(/[^\w.-]+/g, '_').slice(-80);
    const path = `${folder}/${Date.now()}-${safe}`;
    const { error } = await supabase.storage.from('project-photos').upload(path, f, { contentType: f.type, upsert: false });
    if (error) throw new Error('Photo upload failed. Please try again or submit without photos.');
    photo_paths.push(path);
  }
  const { error } = await supabase.from('estimate_requests').insert({ ...lead, photo_paths });
  if (error) throw new Error('We could not send your request. Please try again shortly.');
  if (notifyFn) {
    // Notification failure must never block the visitor's confirmation.
    supabase.functions.invoke(notifyFn, { body: { ...lead, photo_count: photo_paths.length } }).catch(() => {});
  }
}
