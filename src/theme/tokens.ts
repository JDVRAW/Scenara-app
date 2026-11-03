/**
 * SCENARA · Brand direction v1.0
 * Fuente única de verdad para color, tipografía, espaciado y radios.
 */
import { Platform, TextStyle } from 'react-native';

export const palette = {
  onyx: '#0A0A0A',
  charcoal: '#1A1A1A',
  slate: '#2C2C2C',
  titanium: '#8A8A8A',
  sand: '#D6B37A',
  bone: '#F5F5F5',
} as const;

/** Roles semánticos. Las pantallas usan estos, no la paleta directa. */
export const colors = {
  background: palette.onyx,
  surface: palette.charcoal,
  surfaceRaised: palette.slate,
  textPrimary: palette.bone,
  textSecondary: palette.titanium,
  accent: palette.sand,
  accentSoft: 'rgba(214,179,122,0.14)',
  accentBorder: 'rgba(214,179,122,0.40)',
  onAccent: palette.onyx,
  line: 'rgba(245,245,245,0.08)',
  lineStrong: 'rgba(245,245,245,0.16)',
  scrim: 'rgba(10,10,10,0.92)',
} as const;

export const spacing = { xxs: 4, xs: 8, sm: 12, md: 16, lg: 24, xl: 32, xxl: 48, xxxl: 72 } as const;
export const radius = { sm: 8, md: 14, lg: 22, pill: 999 } as const;

/**
 * SF Pro Display para titulares (es la fuente del sistema en iOS).
 * Inter para interfaz y textos; también es el respaldo de titulares en Android.
 */
const display = Platform.select({
  ios: 'System',
  web: 'SF Pro Display, -apple-system, BlinkMacSystemFont, Inter_600SemiBold, sans-serif',
  default: 'Inter_600SemiBold',
});

export const fonts = {
  display,
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

export const type = {
  display: { fontFamily: fonts.display, fontWeight: '600', fontSize: 40, lineHeight: 44, letterSpacing: -0.4 },
  title1: { fontFamily: fonts.display, fontWeight: '600', fontSize: 28, lineHeight: 34, letterSpacing: -0.28 },
  title2: { fontFamily: fonts.display, fontWeight: '600', fontSize: 20, lineHeight: 26 },
  headline: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 20 },
  body: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22 },
  callout: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 18 },
  caption: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 16 },
  label: { fontFamily: fonts.medium, fontSize: 11, lineHeight: 14, letterSpacing: 2, textTransform: 'uppercase' },
  data: { fontFamily: fonts.semibold, fontSize: 13, lineHeight: 18, fontVariant: ['tabular-nums'], letterSpacing: 0.4 },
} satisfies Record<string, TextStyle>;

export type TypeVariant = keyof typeof type;

/**
 * Fotogramas simulados mientras no hay fotografía real.
 * Cada uno es un degradado de dirección cinematográfica.
 */
export const stills = {
  ember: ['#c98a4b', '#5a2f1a', '#120b08'],
  dusk: ['#0e1a24', '#1d3a4a', '#d6b37a', '#0a0a0a'],
  skin: ['#e7d3ac', '#6e5d48', '#1b1814'],
  steel: ['#4b5a63', '#2c2c2c', '#0a0a0a'],
  crimson: ['#b5452b', '#3d1410', '#0a0a0a'],
  fog: ['#d9dde0', '#7e8a92', '#23292e'],
  jungle: ['#2f4a3a', '#121c16', '#050605'],
  velvet: ['#d6b37a', '#3a2c4a', '#14101c'],
} as const;

export type StillName = keyof typeof stills;
