import { Redirect, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { BackHeader, Empty, Loading, ProfileView } from '@/components';
import { getProfile } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useAsync } from '@/lib/useAsync';
import { colors } from '@/theme/tokens';

export default function CreatorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { userId, ready, session } = useAuth();
  const p = useAsync(() => getProfile(id), [id]);

  if (ready && !session) return <Redirect href="/login" />;
  if (id === userId) return <Redirect href="/showcase" />;
  if (p.loading) return <Loading />;
  if (!p.data)
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, padding: 24, gap: 24 }}>
        <BackHeader fallback="/discover" />
        <Empty title="Creator not found" body="This profile doesn’t exist or was removed." />
      </View>
    );
  return <ProfileView profile={p.data} isMe={false} header={<BackHeader fallback="/discover" />} />;
}
