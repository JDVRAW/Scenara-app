import { Loading, ProfileView } from '@/components';
import { useAuth } from '@/lib/auth';

/** Showcase · your professional portfolio */
export default function ShowcaseScreen() {
  const { profile } = useAuth();
  if (!profile) return <Loading label="Loading your profile…" />;
  return <ProfileView profile={profile} isMe />;
}
