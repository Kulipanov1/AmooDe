// Utility functions for Telegram Web App integration

// Type definitions for Telegram WebApp
interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    query_id: string;
    user: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
      photo_url?: string;
    };
    auth_date: number;
    hash: string;
  };
  colorScheme: 'light' | 'dark';
  themeParams: {
    bg_color: string;
    text_color: string;
    hint_color: string;
    link_color: string;
    button_color: string;
    button_text_color: string;
    secondary_bg_color: string;
  };
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  ready: () => void;
  expand: () => void;
  close: () => void;
  showAlert: (message: string, callback?: () => void) => void;
  showConfirm: (message: string, callback: (confirmed: boolean) => void) => void;
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    isProgressVisible: boolean;
    setText: (text: string) => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    showProgress: (leaveActive: boolean) => void;
    hideProgress: () => void;
  };
  BackButton: {
    isVisible: boolean;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
  };
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
  onEvent: (eventType: string, eventHandler: () => void) => void;
  offEvent: (eventType: string, eventHandler: () => void) => void;
}

// Add global type declaration for Telegram
declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

// Check if we're running in Telegram WebApp environment
export const isTelegramWebApp = (): boolean => {
  return typeof window !== 'undefined' && window.Telegram !== undefined && window.Telegram.WebApp !== undefined;
};

// Get the Telegram WebApp instance
export const getTelegramWebApp = (): TelegramWebApp | null => {
  if (isTelegramWebApp()) {
    return window.Telegram?.WebApp || null;
  }
  return null;
};

// Initialize the Telegram WebApp
export const initTelegramWebApp = (): void => {
  const tg = getTelegramWebApp();
  if (tg) {
    // Tell Telegram WebApp we're ready
    tg.ready();
    
    // Expand the WebApp to take full height
    tg.expand();
    
    // Set app theme based on Telegram theme
    if (tg.colorScheme === 'dark') {
      // Apply dark theme
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }
};

// Get user data from Telegram WebApp
export const getTelegramUser = () => {
  const tg = getTelegramWebApp();
  if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
    return tg.initDataUnsafe.user;
  }
  return null;
};

// Show Telegram MainButton
export const showMainButton = (text: string, callback: () => void): void => {
  const tg = getTelegramWebApp();
  if (tg) {
    tg.MainButton.setText(text);
    tg.MainButton.onClick(callback);
    tg.MainButton.show();
  }
};

// Hide Telegram MainButton
export const hideMainButton = (): void => {
  const tg = getTelegramWebApp();
  if (tg) {
    tg.MainButton.hide();
  }
};

// Show Telegram BackButton
export const showBackButton = (callback: () => void): void => {
  const tg = getTelegramWebApp();
  if (tg) {
    tg.BackButton.onClick(callback);
    tg.BackButton.show();
  }
};

// Hide Telegram BackButton
export const hideBackButton = (): void => {
  const tg = getTelegramWebApp();
  if (tg) {
    tg.BackButton.hide();
  }
};

// Show alert in Telegram WebApp
export const showAlert = (message: string, callback?: () => void): void => {
  const tg = getTelegramWebApp();
  if (tg) {
    tg.showAlert(message, callback);
  } else {
    alert(message);
    if (callback) callback();
  }
};

// Show confirmation dialog in Telegram WebApp
export const showConfirm = (message: string, callback: (confirmed: boolean) => void): void => {
  const tg = getTelegramWebApp();
  if (tg) {
    tg.showConfirm(message, callback);
  } else {
    const confirmed = confirm(message);
    callback(confirmed);
  }
};

// Trigger haptic feedback
export const hapticFeedback = (type: 'success' | 'error' | 'warning'): void => {
  const tg = getTelegramWebApp();
  if (tg && tg.HapticFeedback) {
    tg.HapticFeedback.notificationOccurred(type);
  }
};