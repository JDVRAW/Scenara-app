import { createClient } from '@supabase/supabase-js';

import { isConfigured, SUPABASE_ANON_KEY, SUPABASE_URL } from './config';

export const supabase = createClient(
  isConfigured ? SUPABASE_URL : 'https://placeholder.supabase.co',
  isConfigured ? SUPABASE_ANON_KEY : 'placeholder-anon-key',
  { auth: { persistSession: typeof window !== 'undefined', autoRefreshToken: true, detectSessionInUrl: typeof window !== 'undefined' } },
);

export type Profile = {
  id: string;
  name: string;
  role: string;
  city: string;
  bio: string;
  avatar_url: string | null;
  cover_url: string | null;
  kit: string[];
  created_at: string;
};

export type Work = {
  id: string;
  owner: string;
  title: string;
  kind: string;
  year: number | null;
  credit: string;
  image_url: string | null;
  video_url: string | null;
  created_at: string;
};

export type Connection = {
  id: string;
  requester: string;
  addressee: string;
  status: 'pending' | 'accepted';
  created_at: string;
};

export type Message = {
  id: string;
  sender: string;
  recipient: string;
  body: string;
  read_at: string | null;
  created_at: string;
};

export type Project = {
  id: string;
  owner: string;
  title: string;
  kind: string;
  description: string;
  phase: number;
  dates: string;
  cover_url: string | null;
  created_at: string;
};

export type ProjectRole = { id: string; project: string; role: string; member: string | null; created_at: string };
export type RoleRequest = { id: string; role_id: string; applicant: string; note: string; created_at: string };

export type Opportunity = {
  id: string;
  owner: string;
  title: string;
  org: string;
  location: string;
  kind: string;
  rate: string;
  dates: string;
  description: string;
  created_at: string;
};

export type Application = { id: string; opportunity: string; applicant: string; note: string; created_at: string };

/** Throws the Supabase error so screens can show it. */
export function must<T>(res: { data: T; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data;
}
