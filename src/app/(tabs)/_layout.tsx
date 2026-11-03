import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router/js-tabs';

import { colors, fonts } from '@/theme/tokens';

type IconName = keyof typeof Ionicons.glyphMap;

const tabs: { name: string; title: string; icon: IconName; iconActive: IconName }[] = [
  { name: 'index', title: 'Showcase', icon: 'film-outline', iconActive: 'film' },
  { name: 'discover', title: 'Discover', icon: 'compass-outline', iconActive: 'compass' },
  { name: 'connect', title: 'Connect', icon: 'chatbubbles-outline', iconActive: 'chatbubbles' },
  { name: 'collaborate', title: 'Collab', icon: 'people-outline', iconActive: 'people' },
  { name: 'opportunities', title: 'Oportun.', icon: 'star-outline', iconActive: 'star' },
];

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: { backgroundColor: colors.background, borderTopColor: colors.line },
        tabBarLabelStyle: { fontFamily: fonts.medium, fontSize: 10 },
      }}>
      {tabs.map((t) => (
        <Tabs.Screen
          key={t.name}
          name={t.name}
          options={{
            title: t.title,
            tabBarIcon: ({ color, focused, size }) => (
              <Ionicons name={focused ? t.iconActive : t.icon} size={size - 2} color={color as string} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
