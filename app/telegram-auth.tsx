import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useTelegramWebApp } from '@/components/TelegramWebAppProvider';
import { useUserStore } from '@/store/useUserStore';
import Colors from '@/constants/colors';

export default function TelegramAuthScreen() {
  const router = useRouter();
  const { isTelegram, telegramUser, isInitialized } = useTelegramWebApp();
  const { setCurrentUser, setOnboarded } = useUserStore();

  useEffect(() => {
    if (!isInitialized) return;

    if (Platform.OS === 'web' && isTelegram && telegramUser) {
      // Create a user from Telegram data
      const newUser = {
        id: 'current',
        name: telegramUser.first_name + (telegramUser.last_name ? ` ${telegramUser.last_name}` : ''),
        age: 25, // Default age
        bio: 'Telegram user',
        location: 'New York', // Default location
        photos: [
          telegramUser.photo_url || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80'
        ],
        interests: ['Dating'],
        gender: 'Other',
        lookingFor: ['Everyone'],
        ageRange: [18, 40] as [number, number],
        distanceRange: 25
      };

      // Set the user and mark as onboarded
      setCurrentUser(newUser);
      setOnboarded(true);
      
      // Navigate to the main app
      router.replace('/(tabs)');
    } else if (isInitialized) {
      // Not in Telegram or no user data, redirect to normal onboarding
      router.replace('/onboarding');
    }
  }, [isInitialized, isTelegram, telegramUser]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.text}>Authenticating with Telegram...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 20,
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
  },
});