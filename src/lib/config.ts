/**
 * Supabase project for SCENARA.
 * The publishable key is public by design: it ships in the browser and every table is
 * protected by row-level security (see supabase/schema.sql). Never put the secret key here.
 */
export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://zcjdbjfmxqfkbystagoy.supabase.co';
export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_jcZQjHsAeh2tlI8DOFhCug_umgAk1Ok';

export const isConfigured = SUPABASE_URL.startsWith('https://') && SUPABASE_ANON_KEY.length > 20;
