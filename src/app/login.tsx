import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Button, ErrorText, Field, Still, Text } from '@/components';
import { useLayout } from '@/hooks/useLayout';
import { useAuth } from '@/lib/auth';
import { isConfigured } from '@/lib/config';
import { supabase } from '@/lib/supabase';
import { colors, fonts, radius, spacing } from '@/theme/tokens';

export default function Login() {
  const { session, ready } = useAuth();
  const { wide } = useLayout();
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [city, setCity] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  if (ready && session) return <Redirect href="/showcase" />;

  const submit = async () => {
    setError(null);
    setNotice(null);
    if (!isConfigured) return setError('SCENARA is not connected to its database yet.');
    if (!email.trim() || password.length < 6) return setError('Enter your email and a password of at least 6 characters.');
    if (mode === 'signup' && !name.trim()) return setError('Add your name so people can find you.');
    setBusy(true);
    try {
      if (mode === 'signup') {
        const { data, error: e } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { name: name.trim(), role: role.trim(), city: city.trim() } },
        });
        if (e) throw e;
        if (data.session) router.replace('/showcase');
        else setNotice(`We sent a confirmation link to ${email.trim()}. Open it, then log in here.`);
      } else {
        const { error: e } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (e) throw e;
        router.replace('/showcase');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const form = (
    <View style={styles.form}>
      <Text style={styles.wordmark}>SCENARA</Text>
      <View style={{ gap: 6 }}>
        <Text variant="title1">{mode === 'signup' ? 'Create your account' : 'Welcome back'}</Text>
        <Text variant="body" tone="secondary">
          {mode === 'signup' ? 'Show your work, meet other creators and find your next project.' : 'Log in to your SCENARA account.'}
        </Text>
      </View>
      {mode === 'signup' && (
        <>
          <Field id="name" label="Full name" value={name} onChangeText={setName} placeholder="Valeria Ortiz" autoComplete="name" />
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Field id="role" label="Your craft" value={role} onChangeText={setRole} placeholder="Cinematographer" />
            </View>
            <View style={{ flex: 1 }}>
              <Field id="city" label="City" value={city} onChangeText={setCity} placeholder="Mexico City" />
            </View>
          </View>
        </>
      )}
      <Field id="email" label="Email" value={email} onChangeText={setEmail} placeholder="you@studio.com" autoCapitalize="none" keyboardType="email-address" autoComplete="email" />
      <Field id="password" label="Password" value={password} onChangeText={setPassword} placeholder="At least 6 characters" secureTextEntry autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} onSubmitEditing={submit} />
      <ErrorText>{error}</ErrorText>
      {notice && (
        <View style={styles.notice}>
          <Text variant="callout">{notice}</Text>
        </View>
      )}
      <Button label={mode === 'signup' ? 'Create account' : 'Log in'} variant="gold" onPress={submit} loading={busy} />
      <Pressable accessibilityRole="button" onPress={() => { setMode(mode === 'signup' ? 'signin' : 'signup'); setError(null); setNotice(null); }}>
        <Text variant="callout" tone="secondary" style={{ textAlign: 'center' }}>
          {mode === 'signup' ? 'Already have an account? ' : 'New to SCENARA? '}
          <Text variant="callout" tone="accent" style={{ fontFamily: fonts.semibold }}>{mode === 'signup' ? 'Log in' : 'Create an account'}</Text>
        </Text>
      </Pressable>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.page} behavior="padding">
      <View style={[styles.split, wide && { flexDirection: 'row' }]}>
        {wide && <Still name="ember" scrim style={{ flex: 1, minWidth: 0 }} />}
        <ScrollView style={wide ? { width: 520, flexGrow: 0, flexShrink: 0 } : { flex: 1 }} contentContainerStyle={styles.scroll}>
          {form}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  split: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.xxl },
  form: { gap: spacing.md, width: '100%', maxWidth: 420, alignSelf: 'center' },
  wordmark: { fontFamily: fonts.display, fontWeight: '600', fontSize: 16, letterSpacing: 6, color: colors.textPrimary, marginBottom: spacing.md },
  row: { flexDirection: 'row', gap: spacing.sm },
  notice: { padding: spacing.sm, borderRadius: radius.sm, backgroundColor: colors.accentSoft, borderWidth: 1, borderColor: colors.accentBorder },
});
