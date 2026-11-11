import { must, Project, ProjectRole, RoleRequest, supabase } from './supabase';

export const PHASES = ['Develop', 'Prep', 'Shoot', 'Post'];

export async function listProjects() {
  const projects = must(await supabase.from('projects').select('*').order('created_at', { ascending: false }).limit(100)) as Project[];
  const ids = projects.map((p) => p.id);
  const roles = ids.length ? (must(await supabase.from('project_roles').select('*').in('project', ids)) as ProjectRole[]) : [];
  return projects.map((p) => ({ ...p, roles: roles.filter((r) => r.project === p.id) }));
}

export async function getProject(id: string) {
  const project = must(await supabase.from('projects').select('*').eq('id', id).maybeSingle()) as Project | null;
  if (!project) return null;
  const roles = must(await supabase.from('project_roles').select('*').eq('project', id).order('created_at')) as ProjectRole[];
  const requests = roles.length
    ? (must(await supabase.from('role_requests').select('*').in('role_id', roles.map((r) => r.id))) as RoleRequest[])
    : [];
  return { project, roles, requests };
}
