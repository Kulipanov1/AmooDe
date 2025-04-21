import React, { useEffect, createContext, useContext, useState } from 'react';
import { Platform } from 'react-native';
import { 
  initTelegramWebApp, 
  getTelegramUser, 
  isTelegramWebApp 
} from '@/utils/telegramWebApp';

// Create context for Telegram WebApp
interface TelegramWebAppContextType {
  isTelegram: boolean;
  telegramUser: any | null;
  isInitialized: boolean;
}

const TelegramWebAppContext = createContext<TelegramWebAppContextType>({
  isTelegram: false,
  telegramUser: null,
  isInitialized: false
});

export const useTelegramWebApp = () => useContext(TelegramWebAppContext);

interface TelegramWebAppProviderProps {
  children: React.ReactNode;
}

export const TelegramWebAppProvider: React.FC<TelegramWebAppProviderProps> = ({ children }) => {
  const [isTelegram, setIsTelegram] = useState(false);
  const [telegramUser, setTelegramUser] = useState<any | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Only run on web platform
    if (Platform.OS === 'web') {
      const isTg = isTelegramWebApp();
      setIsTelegram(isTg);
      
      if (isTg) {
        // Initialize Telegram WebApp
        initTelegramWebApp();
        
        // Get user data
        const user = getTelegramUser();
        setTelegramUser(user);
      }
      
      setIsInitialized(true);
    } else {
      setIsInitialized(true);
    }
  }, []);

  return (
    <TelegramWebAppContext.Provider value={{ isTelegram, telegramUser, isInitialized }}>
      {children}
    </TelegramWebAppContext.Provider>
  );
};

export default TelegramWebAppProvider;