import { Href, Redirect } from 'expo-router';
import { ReactNode } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/lib/auth';
import { colors, spacing } from '@/theme/tokens';

import { BackHeader } from './BackHeader';
import { Loading } from './Form';

/** Page shell for forms and detail pages: back button, title, scroll, signed-in only. */
export function FormPage({ title, fallback, right, children, maxWidth = 640 }: { title?: string; fallback?: Href; right?: ReactNode; children: ReactNode; maxWidth?: number }) {
  const { ready, session } = useAuth();
  if (!ready) return <Loading />;
  if (!session) return <Redirect href="/login" />;
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView contentContainerStyle={[styles.content, { maxWidth }]} keyboardShouldPersistTaps="handled">
          <BackHeader title={title} fallback={fallback} right={right} />
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { width: '100%', alignSelf: 'center', paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.xxxl, gap: spacing.lg },
});
