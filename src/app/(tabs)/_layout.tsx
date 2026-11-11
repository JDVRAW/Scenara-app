import { Ionicons } from '@expo/vector-icons';
import { Redirect } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';

import { NavItem, Sidebar } from '@/components';
import { Loading } from '@/components';
import { useLayout } from '@/hooks/useLayout';
import { useAuth } from '@/lib/auth';
import { colors, fonts } from '@/theme/tokens';

const tabs: NavItem[] = [
  { name: 'showcase', title: 'Showcase', label: 'Showcase', icon: 'film-outline', iconActive: 'film' },
  { name: 'discover', title: 'Discover', label: 'Discover', icon: 'compass-outline', iconActive: 'compass' },
  { name: 'connect', title: 'Connect', label: 'Connect', icon: 'chatbubbles-outline', iconActive: 'chatbubbles' },
  { name: 'collaborate', title: 'Collab', label: 'Collaborate', icon: 'people-outline', iconActive: 'people' },
  { name: 'opportunities', title: 'Jobs', label: 'Opportunities', icon: 'star-outline', iconActive: 'star' },
];

export default function TabsLayout() {
  const { wide } = useLayout();
  const { ready, session } = useAuth();
  if (!ready) return <Loading />;
  if (!session) return <Redirect href="/login" />;
  return (
    <Tabs
      tabBar={wide ? (props) => <Sidebar {...props} items={tabs} /> : undefined}
      screenOptions={{
        headerShown: false,
        tabBarPosition: wide ? 'left' : 'bottom',
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
            title: `${t.label} · SCENARA`,
            tabBarLabel: t.title,
            tabBarIcon: ({ color, focused, size }) => (
              <Ionicons name={focused ? t.iconActive : t.icon} size={size - 2} color={color as string} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
