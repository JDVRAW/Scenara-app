import { Text as RNText, TextProps } from 'react-native';

import { colors, type, TypeVariant } from '@/theme/tokens';

type Props = TextProps & {
  variant?: TypeVariant;
  tone?: 'primary' | 'secondary' | 'accent' | 'onAccent';
};

const toneColor = {
  primary: colors.textPrimary,
  secondary: colors.textSecondary,
  accent: colors.accent,
  onAccent: colors.onAccent,
};

export function Text({ variant = 'body', tone, style, ...rest }: Props) {
  const defaultTone = variant === 'label' || variant === 'caption' ? 'secondary' : 'primary';
  return <RNText {...rest} style={[type[variant], { color: toneColor[tone ?? defaultTone] }, style]} />;
}
