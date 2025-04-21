import { Redirect } from 'expo-router';
import { useUserStore } from '@/store/useUserStore';
import { View, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { useEffect, useState } from 'react';
import Colors from '@/constants/colors';
import { useTelegramWebApp } from '@/components/TelegramWebAppProvider';

export default function Index() {
  const { isOnboarded } = useUserStore();
  const { isTelegram, isInitialized } = useTelegramWebApp();
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    // Small delay to ensure the root Layout is mounted
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!isReady || !isInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }
  
  // If we're in Telegram WebApp on web, check for auth
  if (Platform.OS === 'web' && isTelegram) {
    return <Redirect href="/telegram-auth" />;
  }
  
  return isOnboarded ? <Redirect href="/(tabs)" /> : <Redirect href="/onboarding" />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  }
});