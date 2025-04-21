import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Heart, MessageCircle, User, Video } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useMatchStore } from '@/store/useMatchStore';

export default function TabLayout() {
  const getUnreadCount = useMatchStore(state => state.getUnreadCount);
  const unreadCount = getUnreadCount();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.inactive,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        headerShown: true,
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Amoo',
          tabBarIcon: ({ color }) => <Heart size={24} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="matches"
        options={{
          title: 'Matches',
          tabBarIcon: ({ color }) => (
            <View>
              <MessageCircle size={24} color={color} />
              {unreadCount > 0 && (
                <View style={styles.badge}>
                  <View style={styles.badgeInner} />
                </View>
              )}
            </View>
          ),
        }}
      />
      
      <Tabs.Screen
        name="lives"
        options={{
          title: 'Live',
          tabBarIcon: ({ color }) => <Video size={24} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  header: {
    backgroundColor: Colors.background,
    shadowColor: 'transparent',
    elevation: 0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    color: Colors.text,
    fontWeight: 'bold',
    fontSize: 18,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -6,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
});