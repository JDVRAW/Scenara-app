import { Connection, Message, must, Profile, supabase, Work } from './supabase';

export async function getProfile(id: string) {
  return must(await supabase.from('profiles').select('*').eq('id', id).maybeSingle()) as Profile | null;
}

export async function getProfiles(ids: string[]) {
  const unique = [...new Set(ids)].filter(Boolean);
  if (!unique.length) return {} as Record<string, Profile>;
  const rows = must(await supabase.from('profiles').select('*').in('id', unique)) as Profile[];
  return Object.fromEntries(rows.map((p) => [p.id, p])) as Record<string, Profile>;
}

export async function listWorks(owner: string) {
  return must(await supabase.from('works').select('*').eq('owner', owner).order('year', { ascending: false, nullsFirst: false }).order('created_at', { ascending: false })) as Work[];
}

export async function myConnections(uid: string) {
  return must(await supabase.from('connections').select('*').or(`requester.eq.${uid},addressee.eq.${uid}`).order('created_at', { ascending: false })) as Connection[];
}

export function otherSide(c: Connection, uid: string) {
  return c.requester === uid ? c.addressee : c.requester;
}

export async function connectionWith(uid: string, other: string) {
  const rows = must(
    await supabase
      .from('connections')
      .select('*')
      .or(`and(requester.eq.${uid},addressee.eq.${other}),and(requester.eq.${other},addressee.eq.${uid})`),
  ) as Connection[];
  return rows[0] ?? null;
}

export async function countConnections(id: string) {
  const { count } = await supabase
    .from('connections')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'accepted')
    .or(`requester.eq.${id},addressee.eq.${id}`);
  return count ?? 0;
}

export async function conversations(uid: string) {
  const msgs = must(
    await supabase.from('messages').select('*').or(`sender.eq.${uid},recipient.eq.${uid}`).order('created_at', { ascending: false }).limit(500),
  ) as Message[];
  const byOther = new Map<string, { last: Message; unread: number }>();
  for (const m of msgs) {
    const other = m.sender === uid ? m.recipient : m.sender;
    const entry = byOther.get(other) ?? { last: m, unread: 0 };
    if (m.recipient === uid && !m.read_at) entry.unread += 1;
    byOther.set(other, entry);
  }
  return [...byOther.entries()].map(([other, v]) => ({ other, ...v }));
}

export function timeAgo(iso: string) {
  const d = new Date(iso);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return 'now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (diff < 7 * 86400) return d.toLocaleDateString([], { weekday: 'short' });
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}
