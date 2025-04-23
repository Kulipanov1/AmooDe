// =====================================================================
// ПОЛНЫЙ КОД ПРИЛОЖЕНИЯ AMOO DATING APP С ИНТЕГРАЦИЕЙ TELEGRAM
// =====================================================================

// =====================================================================
// app.json
// =====================================================================
/*
{
  "expo": {
    "name": "Amoo Dating App",
    "slug": "amoo-dating-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "amoo",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/images/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "app.rork.amoo-dating-app"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "app.rork.amoo-dating-app"
    },
    "web": {
      "bundler": "metro",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-image-picker",
        {
          "photosPermission": "The app accesses your photos to let you share them with your matches."
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    }
  }
}
*/

// =====================================================================
// package.json
// =====================================================================
/*
{
  "name": "expo-app",
  "main": "expo-router/entry",
  "version": "1.0.0",
  "scripts": {
    "start": "expo start --tunnel",
    "start-web": "expo start --web --tunnel",
    "start-web-dev": "DEBUG=expo* expo start --web --tunnel"
  },
  "dependencies": {
    "@expo/vector-icons": "^14.0.2",
    "@react-native-async-storage/async-storage": "1.23.1",
    "@react-navigation/native": "^7.0.0",
    "axios": "^1.8.4",
    "babel-plugin-module-resolver": "^5.0.2",
    "cors": "^2.8.5",
    "dotenv": "^16.5.0",
    "expo": "~52.0.36",
    "expo-blur": "~14.0.1",
    "expo-constants": "~17.0.7",
    "expo-font": "~13.0.4",
    "expo-haptics": "~14.0.0",
    "expo-image": "~2.0.6",
    "expo-image-picker": "^16.0.6",
    "expo-linear-gradient": "^14.0.1",
    "expo-linking": "~7.0.3",
    "expo-location": "~18.0.7",
    "expo-router": "~4.0.17",
    "expo-splash-screen": "~0.29.22",
    "expo-status-bar": "~2.0.0",
    "expo-symbols": "~0.2.0",
    "expo-system-ui": "~4.0.6",
    "expo-web-browser": "~14.0.1",
    "express": "^5.1.0",
    "lucide-react-native": "^0.475.0",
    "module-resolver": "^1.0.0",
    "nativewind": "^4.1.23",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "react-native": "0.76.7",
    "react-native-gesture-handler": "~2.20.2",
    "react-native-safe-area-context": "4.12.0",
    "react-native-screens": "~4.4.0",
    "react-native-svg": "15.8.0",
    "react-native-web": "~0.19.13",
    "zustand": "^5.0.2"
  },
  "devDependencies": {
    "@babel/core": "^7.25.2",
    "@expo/ngrok": "^4.1.0",
    "@types/react": "~18.3.12",
    "typescript": "~5.8.2"
  },
  "private": true
}
*/

// =====================================================================
// constants/colors.ts
// =====================================================================
const Colors = {
  primary: '#FF6B6B',
  secondary: '#4ECDC4',
  background: '#FFFFFF',
  card: '#FFFFFF',
  text: '#333333',
  subtext: '#8E8E93',
  border: '#E5E5EA',
  success: '#34C759',
  error: '#FF3B30',
  warning: '#FFCC00',
  inactive: '#C7C7CC',
  gradient: {
    start: '#FF6B6B',
    end: '#FF8E8E'
  }
};

// =====================================================================
// types/index.ts
// =====================================================================
/*
export interface User {
  id: string;
  name: string;
  age: number;
  bio: string;
  location: string;
  distance: number;
  photos: string[];
  interests: string[];
  lastActive?: string;
}

export interface Match {
  id: string;
  userId: string;
  matchedAt: string;
  lastMessage?: Message;
  unreadCount: number;
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface CurrentUser {
  id: string;
  name: string;
  age: number;
  bio: string;
  location: string;
  photos: string[];
  interests: string[];
  gender: string;
  lookingFor: string[];
  ageRange: [number, number];
  distanceRange: number;
}

export interface LiveStream {
  id: string;
  hostName: string;
  hostId: string;
  hostAvatar: string;
  title: string;
  thumbnailUrl: string;
  viewerCount: number;
  likeCount: string | number;
  startedAt: string;
  tags: string[];
}

export interface LiveComment {
  id: string;
  username: string;
  text: string;
  timestamp: string;
}
*/

// =====================================================================
// mocks/users.ts
// =====================================================================
const mockUsers = [
  {
    id: '1',
    name: 'Sophia',
    age: 28,
    bio: 'Coffee enthusiast, yoga lover, and adventure seeker. Let\'s explore the city together!',
    location: 'New York',
    distance: 5,
    photos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80'
    ],
    interests: ['Travel', 'Yoga', 'Photography', 'Coffee'],
    lastActive: '2 min ago'
  },
  {
    id: '2',
    name: 'Alex',
    age: 30,
    bio: "Architect by day, chef by night. I can design your dream house and cook you dinner in it.",
    location: 'Brooklyn',
    distance: 8,
    photos: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
      'https://images.unsplash.com/photo-1488161628813-04466f872be2?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80'
    ],
    interests: ['Architecture', 'Cooking', 'Hiking', 'Jazz'],
    lastActive: '1 hour ago'
  },
  {
    id: '3',
    name: 'Emma',
    age: 26,
    bio: 'Book lover, cat person, and part-time adventurer. Looking for someone to share stories with.',
    location: 'Manhattan',
    distance: 3,
    photos: [
      'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
      'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80'
    ],
    interests: ['Reading', 'Cats', 'Movies', 'Art'],
    lastActive: '30 min ago'
  },
  {
    id: '4',
    name: 'James',
    age: 32,
    bio: 'Tech entrepreneur who loves outdoor activities. Can talk about startups or hiking trails with equal enthusiasm.',
    location: 'Queens',
    distance: 12,
    photos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80'
    ],
    interests: ['Startups', 'Hiking', 'Technology', 'Fitness'],
    lastActive: '5 hours ago'
  },
  {
    id: '5',
    name: 'Olivia',
    age: 27,
    bio: 'Music teacher with a passion for travel. I collect vinyl records and stories from around the world.',
    location: 'Brooklyn',
    distance: 7,
    photos: [
      'https://images.unsplash.com/photo-1498551172505-8ee7ad69f235?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
      'https://images.unsplash.com/photo-1504703395950-b89145a5425b?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80'
    ],
    interests: ['Music', 'Travel', 'Vinyl', 'Teaching'],
    lastActive: 'Just now'
  }
];

// =====================================================================
// mocks/matches.ts
// =====================================================================
const mockMatches = [
  {
    id: 'm1',
    userId: '1',
    matchedAt: '2023-06-15T14:30:00Z',
    lastMessage: {
      id: 'msg1',
      matchId: 'm1',
      senderId: '1',
      text: "Hey there! How's your day going?",
      timestamp: '2023-06-15T15:45:00Z',
      read: false
    },
    unreadCount: 1
  },
  {
    id: 'm2',
    userId: '2',
    matchedAt: '2023-06-14T09:20:00Z',
    lastMessage: {
      id: 'msg2',
      matchId: 'm2',
      senderId: 'current',
      text: "Would you like to grab coffee sometime?",
      timestamp: '2023-06-14T18:30:00Z',
      read: true
    },
    unreadCount: 0
  },
  {
    id: 'm3',
    userId: '3',
    matchedAt: '2023-06-13T22:15:00Z',
    lastMessage: {
      id: 'msg3',
      matchId: 'm3',
      senderId: '3',
      text: "I love that book too! Have you read the author's latest work?",
      timestamp: '2023-06-14T10:05:00Z',
      read: false
    },
    unreadCount: 2
  },
  {
    id: 'm4',
    userId: '4',
    matchedAt: '2023-06-12T16:40:00Z',
    unreadCount: 0
  },
  {
    id: 'm5',
    userId: '5',
    matchedAt: '2023-06-11T13:25:00Z',
    lastMessage: {
      id: 'msg4',
      matchId: 'm5',
      senderId: 'current',
      text: "That concert sounds amazing! I'd love to join you.",
      timestamp: '2023-06-12T20:15:00Z',
      read: true
    },
    unreadCount: 0
  }
];

// =====================================================================
// mocks/messages.ts
// =====================================================================
const mockMessages = {
  'm1': [
    {
      id: 'msg1-1',
      matchId: 'm1',
      senderId: '1',
      text: "Hey there! I noticed we matched. How are you doing?",
      timestamp: '2023-06-15T14:35:00Z',
      read: true
    },
    {
      id: 'msg1-2',
      matchId: 'm1',
      senderId: 'current',
      text: "Hi Sophia! I'm doing great, thanks for asking. I really liked your travel photos!",
      timestamp: '2023-06-15T14:40:00Z',
      read: true
    },
    {
      id: 'msg1-3',
      matchId: 'm1',
      senderId: '1',
      text: "Thank you! Those were from my trip to Italy last summer. Have you been there?",
      timestamp: '2023-06-15T14:45:00Z',
      read: true
    },
    {
      id: 'msg1-4',
      matchId: 'm1',
      senderId: 'current',
      text: "Not yet, but it's definitely on my bucket list! Any recommendations?",
      timestamp: '2023-06-15T14:50:00Z',
      read: true
    },
    {
      id: 'msg1-5',
      matchId: 'm1',
      senderId: '1',
      text: "Absolutely! You have to visit Florence and the Amalfi Coast. The food is amazing and the views are breathtaking.",
      timestamp: '2023-06-15T15:00:00Z',
      read: true
    },
    {
      id: 'msg1-6',
      matchId: 'm1',
      senderId: 'current',
      text: "That sounds incredible. Maybe we could plan a trip together someday 😊",
      timestamp: '2023-06-15T15:10:00Z',
      read: true
    },
    {
      id: 'msg1-7',
      matchId: 'm1',
      senderId: '1',
      text: "I'd like that! So, what do you enjoy doing in your free time?",
      timestamp: '2023-06-15T15:45:00Z',
      read: false
    }
  ],
  'm2': [
    {
      id: 'msg2-1',
      matchId: 'm2',
      senderId: '2',
      text: "Hey! Nice to match with you. Your profile is interesting!",
      timestamp: '2023-06-14T09:25:00Z',
      read: true
    },
    {
      id: 'msg2-2',
      matchId: 'm2',
      senderId: 'current',
      text: "Thanks Alex! I was intrigued by your architecture background. What kind of projects do you work on?",
      timestamp: '2023-06-14T10:15:00Z',
      read: true
    },
    {
      id: 'msg2-3',
      matchId: 'm2',
      senderId: '2',
      text: "Currently I'm working on sustainable housing designs. It's challenging but rewarding. What about you?",
      timestamp: '2023-06-14T11:30:00Z',
      read: true
    },
    {
      id: 'msg2-4',
      matchId: 'm2',
      senderId: 'current',
      text: "That sounds fascinating! I work in digital marketing, but I've always appreciated good design.",
      timestamp: '2023-06-14T12:45:00Z',
      read: true
    },
    {
      id: 'msg2-5',
      matchId: 'm2',
      senderId: '2',
      text: "Digital marketing is cool! Maybe we could collaborate sometime. Are you free this weekend?",
      timestamp: '2023-06-14T14:20:00Z',
      read: true
    },
    {
      id: 'msg2-6',
      matchId: 'm2',
      senderId: 'current',
      text: "Would you like to grab coffee sometime?",
      timestamp: '2023-06-14T18:30:00Z',
      read: true
    }
  ],
  'm3': [
    {
      id: 'msg3-1',
      matchId: 'm3',
      senderId: 'current',
      text: "Hi Emma! I noticed you're a book lover too. What are you reading currently?",
      timestamp: '2023-06-13T22:20:00Z',
      read: true
    },
    {
      id: 'msg3-2',
      matchId: 'm3',
      senderId: '3',
      text: "Hey there! I'm reading 'The Midnight Library' by Matt Haig. Have you read it?",
      timestamp: '2023-06-13T22:45:00Z',
      read: true
    },
    {
      id: 'msg3-3',
      matchId: 'm3',
      senderId: 'current',
      text: "Yes! I absolutely loved that book. The concept is so thought-provoking.",
      timestamp: '2023-06-14T08:30:00Z',
      read: true
    },
    {
      id: 'msg3-4',
      matchId: 'm3',
      senderId: '3',
      text: "I love that book too! Have you read the author's latest work?",
      timestamp: '2023-06-14T10:05:00Z',
      read: false
    }
  ],
  'm5': [
    {
      id: 'msg5-1',
      matchId: 'm5',
      senderId: '5',
      text: "Hello! I see you're into indie music too. Any favorite bands?",
      timestamp: '2023-06-11T13:30:00Z',
      read: true
    },
    {
      id: 'msg5-2',
      matchId: 'm5',
      senderId: 'current',
      text: "Hi Olivia! Yes, I love Arcade Fire and Vampire Weekend. How about you?",
      timestamp: '2023-06-11T14:15:00Z',
      read: true
    },
    {
      id: 'msg5-3',
      matchId: 'm5',
      senderId: '5',
      text: "Great taste! I'm a big fan of those too, plus The National and Bon Iver. There's a cool concert happening next weekend if you're interested?",
      timestamp: '2023-06-11T15:40:00Z',
      read: true
    },
    {
      id: 'msg5-4',
      matchId: 'm5',
      senderId: 'current',
      text: "That concert sounds amazing! I'd love to join you.",
      timestamp: '2023-06-12T20:15:00Z',
      read: true
    }
  ]
};

// =====================================================================
// mocks/interests.ts
// =====================================================================
const interests = [
  'Travel',
  'Photography',
  'Cooking',
  'Fitness',
  'Reading',
  'Music',
  'Art',
  'Movies',
  'Dancing',
  'Hiking',
  'Yoga',
  'Gaming',
  'Technology',
  'Fashion',
  'Sports',
  'Coffee',
  'Wine',
  'Food',
  'Pets',
  'Outdoors',
  'Cycling',
  'Running',
  'Swimming',
  'Meditation',
  'Volunteering',
  'Languages',
  'Writing',
  'Singing',
  'Gardening',
  'Astronomy'
];

// =====================================================================
// mocks/liveStreams.ts
// =====================================================================
const mockLiveStreams = [
  {
    id: '1',
    hostName: 'Sophia',
    hostId: '1',
    hostAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    title: 'Morning coffee chat ☕',
    thumbnailUrl: 'https://images.unsplash.com/photo-1515592302748-6c5ea17e2f0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    viewerCount: 243,
    likeCount: '1.2k',
    startedAt: '2023-06-15T08:30:00Z',
    tags: ['Coffee', 'Morning', 'Chat']
  },
  {
    id: '2',
    hostName: 'Alex',
    hostId: '2',
    hostAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    title: 'Cooking dinner - Italian pasta 🍝',
    thumbnailUrl: 'https://images.unsplash.com/photo-1556761223-4c4282c73f77?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    viewerCount: 578,
    likeCount: '3.4k',
    startedAt: '2023-06-15T18:15:00Z',
    tags: ['Cooking', 'Italian', 'Dinner']
  },
  {
    id: '3',
    hostName: 'Emma',
    hostId: '3',
    hostAvatar: 'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    title: 'Book review - Latest bestsellers 📚',
    thumbnailUrl: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    viewerCount: 132,
    likeCount: '856',
    startedAt: '2023-06-15T16:45:00Z',
    tags: ['Books', 'Reading', 'Review']
  },
  {
    id: '4',
    hostName: 'James',
    hostId: '4',
    hostAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    title: 'Hiking in the mountains 🏔️',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    viewerCount: 421,
    likeCount: '2.1k',
    startedAt: '2023-06-15T10:20:00Z',
    tags: ['Hiking', 'Outdoors', 'Nature']
  },
  {
    id: '5',
    hostName: 'Olivia',
    hostId: '5',
    hostAvatar: 'https://images.unsplash.com/photo-1498551172505-8ee7ad69f235?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    title: 'Live music session 🎵',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    viewerCount: 892,
    likeCount: '5.7k',
    startedAt: '2023-06-15T20:00:00Z',
    tags: ['Music', 'Live', 'Performance']
  }
];

// =====================================================================
// utils/telegramWebApp.ts
// =====================================================================
// Type definitions for Telegram WebApp
/*
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
*/

// Check if we're running in Telegram WebApp environment
const isTelegramWebApp = () => {
  return typeof window !== 'undefined' && window.Telegram !== undefined && window.Telegram.WebApp !== undefined;
};

// Get the Telegram WebApp instance
const getTelegramWebApp = () => {
  if (isTelegramWebApp()) {
    return window.Telegram?.WebApp || null;
  }
  return null;
};

// Initialize the Telegram WebApp
const initTelegramWebApp = () => {
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
const getTelegramUser = () => {
  const tg = getTelegramWebApp();
  if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
    return tg.initDataUnsafe.user;
  }
  return null;
};

// Show Telegram MainButton
const showMainButton = (text, callback) => {
  const tg = getTelegramWebApp();
  if (tg) {
    tg.MainButton.setText(text);
    tg.MainButton.onClick(callback);
    tg.MainButton.show();
  }
};

// Hide Telegram MainButton
const hideMainButton = () => {
  const tg = getTelegramWebApp();
  if (tg) {
    tg.MainButton.hide();
  }
};

// Show Telegram BackButton
const showBackButton = (callback) => {
  const tg = getTelegramWebApp();
  if (tg) {
    tg.BackButton.onClick(callback);
    tg.BackButton.show();
  }
};

// Hide Telegram BackButton
const hideBackButton = () => {
  const tg = getTelegramWebApp();
  if (tg) {
    tg.BackButton.hide();
  }
};

// Show alert in Telegram WebApp
const showAlert = (message, callback) => {
  const tg = getTelegramWebApp();
  if (tg) {
    tg.showAlert(message, callback);
  } else {
    alert(message);
    if (callback) callback();
  }
};

// Show confirmation dialog in Telegram WebApp
const showConfirm = (message, callback) => {
  const tg = getTelegramWebApp();
  if (tg) {
    tg.showConfirm(message, callback);
  } else {
    const confirmed = confirm(message);
    callback(confirmed);
  }
};

// Trigger haptic feedback
const hapticFeedback = (type) => {
  const tg = getTelegramWebApp();
  if (tg && tg.HapticFeedback) {
    tg.HapticFeedback.notificationOccurred(type);
  }
};

// =====================================================================
// store/useUserStore.js
// =====================================================================
/*
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CurrentUser, User } from '@/types';
import { mockUsers } from '@/mocks/users';

interface UserState {
  currentUser: CurrentUser | null;
  potentialMatches: User[];
  likedUsers: string[];
  dislikedUsers: string[];
  isOnboarded: boolean;
  setCurrentUser: (user: CurrentUser) => void;
  updateCurrentUser: (updates: Partial<CurrentUser>) => void;
  likeUser: (userId: string) => void;
  dislikeUser: (userId: string) => void;
  resetSwipes: () => void;
  setOnboarded: (value: boolean) => void;
  getNextPotentialMatches: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      potentialMatches: [],
      likedUsers: [],
      dislikedUsers: [],
      isOnboarded: false,
      
      setCurrentUser: (user) => set({ currentUser: user }),
      
      updateCurrentUser: (updates) => set((state) => ({
        currentUser: state.currentUser ? { ...state.currentUser, ...updates } : null
      })),
      
      likeUser: (userId) => set((state) => ({
        likedUsers: [...state.likedUsers, userId],
        potentialMatches: state.potentialMatches.filter(user => user.id !== userId)
      })),
      
      dislikeUser: (userId) => set((state) => ({
        dislikedUsers: [...state.dislikedUsers, userId],
        potentialMatches: state.potentialMatches.filter(user => user.id !== userId)
      })),
      
      resetSwipes: () => set({ likedUsers: [], dislikedUsers: [] }),
      
      setOnboarded: (value) => set({ isOnboarded: value }),
      
      getNextPotentialMatches: () => {
        const { likedUsers, dislikedUsers } = get();
        const excludedIds = [...likedUsers, ...dislikedUsers];
        
        // In a real app, this would be an API call with pagination
        const newMatches = mockUsers.filter(user => !excludedIds.includes(user.id));
        
        set({ potentialMatches: newMatches });
      }
    }),
    {
      name: 'amoo-user-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
*/

// =====================================================================
// store/useMatchStore.js
// =====================================================================
/*
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Match, Message } from '@/types';
import { mockMatches } from '@/mocks/matches';
import { mockMessages } from '@/mocks/messages';

interface MatchState {
  matches: Match[];
  messages: Record<string, Message[]>;
  loadMatches: () => void;
  loadMessages: (matchId: string) => void;
  sendMessage: (matchId: string, text: string) => void;
  markAsRead: (matchId: string) => void;
  getUnreadCount: () => number;
}

export const useMatchStore = create<MatchState>()(
  persist(
    (set, get) => ({
      matches: [],
      messages: {},
      
      loadMatches: () => {
        // In a real app, this would be an API call
        set({ matches: mockMatches });
      },
      
      loadMessages: (matchId) => {
        // In a real app, this would be an API call
        const matchMessages = mockMessages[matchId] || [];
        set((state) => ({
          messages: {
            ...state.messages,
            [matchId]: matchMessages
          }
        }));
      },
      
      sendMessage: (matchId, text) => {
        const newMessage: Message = {
          id: `msg-${Date.now()}`,
          matchId,
          senderId: 'current',
          text,
          timestamp: new Date().toISOString(),
          read: false
        };
        
        set((state) => {
          // Update messages
          const matchMessages = state.messages[matchId] || [];
          const updatedMessages = {
            ...state.messages,
            [matchId]: [...matchMessages, newMessage]
          };
          
          // Update match with last message
          const updatedMatches = state.matches.map(match => 
            match.id === matchId 
              ? { ...match, lastMessage: newMessage, unreadCount: 0 }
              : match
          );
          
          return {
            messages: updatedMessages,
            matches: updatedMatches
          };
        });
      },
      
      markAsRead: (matchId) => {
        set((state) => {
          // Update match unread count
          const updatedMatches = state.matches.map(match => 
            match.id === matchId 
              ? { ...match, unreadCount: 0 }
              : match
          );
          
          // Mark messages as read
          const matchMessages = state.messages[matchId] || [];
          const updatedMessages = matchMessages.map(msg => 
            msg.senderId !== 'current' && !msg.read 
              ? { ...msg, read: true }
              : msg
          );
          
          return {
            matches: updatedMatches,
            messages: {
              ...state.messages,
              [matchId]: updatedMessages
            }
          };
        });
      },
      
      getUnreadCount: () => {
        const { matches } = get();
        return matches.reduce((total, match) => total + match.unreadCount, 0);
      }
    }),
    {
      name: 'amoo-match-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
*/

// =====================================================================
// components/TelegramWebAppProvider.jsx
// =====================================================================
/*
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
*/

// =====================================================================
// components/TelegramShare.jsx
// =====================================================================
/*
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Share, Platform } from 'react-native';
import { Send } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { User } from '@/types';

interface TelegramShareProps {
  user?: User;
  customMessage?: string;
}

const TelegramShare: React.FC<TelegramShareProps> = ({ user, customMessage }) => {
  const shareToTelegram = async () => {
    try {
      const message = customMessage || 
        (user ? 
          `Check out ${user.name}'s profile on Amoo Dating App! They're ${user.age} years old and into ${user.interests.join(', ')}.` : 
          "Check out Amoo Dating App!");
      
      // For iOS, we can use the Telegram URL scheme
      if (Platform.OS === 'ios') {
        const url = `tg://msg?text=${encodeURIComponent(message)}`;
        await Share.share({
          url,
        });
      } else {
        // For Android and Web
        await Share.share({
          message,
        });
      }
    } catch (error) {
      console.error('Error sharing to Telegram:', error);
    }
  };

  return (
    <TouchableOpacity style={styles.shareButton} onPress={shareToTelegram}>
      <Send size={18} color="#FFFFFF" style={styles.icon} />
      <Text style={styles.shareText}>Share via Telegram</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginVertical: 10,
  },
  icon: {
    marginRight: 8,
  },
  shareText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TelegramShare;
*/

// =====================================================================
// app/telegram-auth.tsx
// =====================================================================
/*
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
*/

// =====================================================================
// server/index.js
// =====================================================================
/*
// Simple Node.js server for Telegram Bot API integration
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Replace with your actual Telegram Bot token
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'YOUR_BOT_TOKEN';
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Store user data (in a real app, use a database)
const users = {};
const matches = {};

// Webhook endpoint for Telegram updates
app.post('/webhook', async (req, res) => {
  try {
    const update = req.body;
    
    // Handle different types of updates
    if (update.message) {
      await handleMessage(update.message);
    } else if (update.callback_query) {
      await handleCallbackQuery(update.callback_query);
    }
    
    res.sendStatus(200);
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.sendStatus(500);
  }
});

// Handle incoming messages
async function handleMessage(message) {
  const chatId = message.chat.id;
  const text = message.text;
  
  // Store user if not already stored
  if (!users[chatId]) {
    users[chatId] = {
      id: chatId,
      name: message.from.first_name,
      username: message.from.username,
      lastActivity: new Date()
    };
  }
  
  // Handle commands
  if (text.startsWith('/')) {
    await handleCommand(chatId, text);
    return;
  }
  
  // Default response
  await sendMessage(chatId, "I'm your Amoo Dating assistant. Type /help to see available commands.");
}

// Handle commands
async function handleCommand(chatId, command) {
  switch (command) {
    case '/start':
      await sendMessage(
        chatId, 
        "Welcome to Amoo Dating Bot! 💕

I can help you find matches and manage your dating profile. Type /help to see all commands."
      );
      break;
      
    case '/help':
      await sendMessage(
        chatId,
        "Available commands:
" +
        "/start - Start the bot
" +
        "/profile - View your profile
" +
        "/matches - View your matches
" +
        "/search - Find new matches
" +
        "/settings - Change your preferences"
      );
      break;
      
    case '/profile':
      const user = users[chatId];
      if (user) {
        await sendMessage(
          chatId,
          `Your Profile:

Name: ${user.name}
Username: @${user.username || 'Not set'}`
        );
      } else {
        await sendMessage(chatId, "You don't have a profile yet. Use /start to create one.");
      }
      break;
      
    case '/matches':
      const userMatches = matches[chatId] || [];
      if (userMatches.length > 0) {
        let matchText = "Your Matches:

";
        userMatches.forEach((match, index) => {
          matchText += `${index + 1}. ${match.name}, ${match.age} - ${match.distance} miles away
`;
        });
        await sendMessage(chatId, matchText);
      } else {
        await sendMessage(chatId, "You don't have any matches yet. Use /search to find new people!");
      }
      break;
      
    case '/search':
      // Simulate finding a match
      const potentialMatch = {
        id: Math.floor(Math.random() * 1000),
        name: ['Sophia', 'Alex', 'Emma', 'James', 'Olivia'][Math.floor(Math.random() * 5)],
        age: Math.floor(Math.random() * 10) + 25,
        distance: Math.floor(Math.random() * 20) + 1,
        bio: "I love hiking and photography. Looking for someone to share adventures with!"
      };
      
      await sendMessage(
        chatId,
        `Found a potential match!

Name: ${potentialMatch.name}
Age: ${potentialMatch.age}
Distance: ${potentialMatch.distance} miles
Bio: ${potentialMatch.bio}`,
        {
          reply_markup: {
            inline_keyboard: [
              [
                { text: "❤️ Like", callback_data: `like_${potentialMatch.id}` },
                { text: "👎 Pass", callback_data: `pass_${potentialMatch.id}` }
              ]
            ]
          }
        }
      );
      break;
      
    case '/settings':
      await sendMessage(
        chatId,
        "Settings:

Change your preferences by selecting options below:",
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: "Age Range", callback_data: "settings_age" }],
              [{ text: "Distance", callback_data: "settings_distance" }],
              [{ text: "Gender Preference", callback_data: "settings_gender" }]
            ]
          }
        }
      );
      break;
      
    default:
      await sendMessage(chatId, "Unknown command. Type /help to see available commands.");
  }
}

// Handle callback queries (button clicks)
async function handleCallbackQuery(callbackQuery) {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;
  
  // Acknowledge the callback query
  await axios.post(`${TELEGRAM_API}/answerCallbackQuery`, {
    callback_query_id: callbackQuery.id
  });
  
  if (data.startsWith('like_')) {
    const matchId = data.split('_')[1];
    // Add to matches
    if (!matches[chatId]) {
      matches[chatId] = [];
    }
    
    // Create a match
    const newMatch = {
      id: matchId,
      name: ['Sophia', 'Alex', 'Emma', 'James', 'Olivia'][Math.floor(Math.random() * 5)],
      age: Math.floor(Math.random() * 10) + 25,
      distance: Math.floor(Math.random() * 20) + 1
    };
    
    matches[chatId].push(newMatch);
    
    await sendMessage(chatId, `You liked this person! They've been added to your matches.`);
    
    // 30% chance of mutual match
    if (Math.random() < 0.3) {
      await sendMessage(
        chatId, 
        `🎉 It's a match! ${newMatch.name} liked you back!

Send them a message to start chatting.`,
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: "Send Message", callback_data: `message_${matchId}` }]
            ]
          }
        }
      );
    }
  } else if (data.startsWith('pass_')) {
    await sendMessage(chatId, "You passed on this person. Use /search to find more matches.");
  } else if (data.startsWith('message_')) {
    await sendMessage(chatId, "Send your message below:");
  } else if (data.startsWith('settings_')) {
    const setting = data.split('_')[1];
    switch (setting) {
      case 'age':
        await sendMessage(chatId, "Select your preferred age range:", {
          reply_markup: {
            inline_keyboard: [
              [{ text: "18-25", callback_data: "age_18_25" }],
              [{ text: "25-35", callback_data: "age_25_35" }],
              [{ text: "35-50", callback_data: "age_35_50" }],
              [{ text: "50+", callback_data: "age_50_plus" }]
            ]
          }
        });
        break;
        
      case 'distance':
        await sendMessage(chatId, "Select your preferred maximum distance:", {
          reply_markup: {
            inline_keyboard: [
              [{ text: "5 miles", callback_data: "distance_5" }],
              [{ text: "10 miles", callback_data: "distance_10" }],
              [{ text: "25 miles", callback_data: "distance_25" }],
              [{ text: "50+ miles", callback_data: "distance_50_plus" }]
            ]
          }
        });
        break;
        
      case 'gender':
        await sendMessage(chatId, "Select who you want to see:", {
          reply_markup: {
            inline_keyboard: [
              [{ text: "Women", callback_data: "gender_women" }],
              [{ text: "Men", callback_data: "gender_men" }],
              [{ text: "Everyone", callback_data: "gender_everyone" }]
            ]
          }
        });
        break;
    }
  }
}

// Helper function to send messages
async function sendMessage(chatId, text, extra = {}) {
  try {
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      ...extra
    });
  } catch (error) {
    console.error('Error sending message:', error.response?.data || error.message);
  }
}

// API endpoint to get user data
app.get('/api/users/:userId', (req, res) => {
  const userId = req.params.userId;
  const user = users[userId];
  
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// API endpoint to get matches
app.get('/api/matches/:userId', (req, res) => {
  const userId = req.params.userId;
  const userMatches = matches[userId] || [];
  
  res.json(userMatches);
});

// API endpoint to send a notification to a user
app.post('/api/notify', async (req, res) => {
  const { userId, message } = req.body;
  
  if (!userId || !message) {
    return res.status(400).json({ error: 'Missing userId or message' });
  }
  
  try {
    await sendMessage(userId, message);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Set webhook (in production, use a proper HTTPS URL)
  // axios.post(`${TELEGRAM_API}/setWebhook`, {
  //   url: 'https://your-domain.com/webhook'
  // }).then(() => {
  //   console.log('Webhook set successfully');
  // }).catch(error => {
  //   console.error('Error setting webhook:', error);
  // });
});
*/

// =====================================================================
// public/telegram-webapp.html
// =====================================================================
/*
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Amoo Dating App</title>
  <script src="https://telegram.org/js/telegram-web-app.js"></script>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
      color: #333;
    }
    #app {
      max-width: 500px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 20px;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #FF6B6B;
    }
    .card {
      background-color: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;
    }
    .card-image {
      width: 100%;
      height: 300px;
      object-fit: cover;
    }
    .card-content {
      padding: 16px;
    }
    .name {
      font-size: 22px;
      font-weight: bold;
      margin-bottom: 4px;
    }
    .info {
      color: #666;
      margin-bottom: 12px;
    }
    .bio {
      margin-bottom: 16px;
      line-height: 1.4;
    }
    .interests {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 16px;
    }
    .interest-tag {
      background-color: #f0f0f0;
      padding: 6px 12px;
      border-radius: 16px;
      font-size: 14px;
    }
    .actions {
      display: flex;
      justify-content: space-between;
      padding: 16px;
    }
    .button {
      border: none;
      border-radius: 50%;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      cursor: pointer;
    }
    .like-button {
      color: #34C759;
    }
    .dislike-button {
      color: #FF3B30;
    }
    .info-button {
      color: #007AFF;
      width: 44px;
      height: 44px;
    }
    .navigation {
      display: flex;
      justify-content: space-around;
      padding: 16px 0;
      background-color: white;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    }
    .nav-item {
      color: #8E8E93;
      text-align: center;
      font-size: 12px;
    }
    .nav-item.active {
      color: #FF6B6B;
    }
    .icon {
      font-size: 24px;
      margin-bottom: 4px;
    }
    .dark-theme {
      background-color: #1C1C1E;
      color: #FFFFFF;
    }
    .dark-theme .card {
      background-color: #2C2C2E;
    }
    .dark-theme .interest-tag {
      background-color: #3A3A3C;
      color: #FFFFFF;
    }
    .dark-theme .navigation {
      background-color: #2C2C2E;
    }
    .dark-theme .button {
      background-color: #3A3A3C;
    }
    .dark-theme .nav-item {
      color: #8E8E93;
    }
  </style>
</head>
<body>
  <div id="app">
    <div class="header">
      <div class="logo">Amoo</div>
    </div>
    
    <div class="card">
      <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80" alt="Profile photo" class="card-image">
      <div class="card-content">
        <div class="name">Sophia, 28</div>
        <div class="info">New York • 5 miles away</div>
        <div class="bio">Coffee enthusiast, yoga lover, and adventure seeker. Let's explore the city together!</div>
        <div class="interests">
          <span class="interest-tag">Travel</span>
          <span class="interest-tag">Yoga</span>
          <span class="interest-tag">Photography</span>
          <span class="interest-tag">Coffee</span>
        </div>
      </div>
      <div class="actions">
        <button class="button dislike-button">✕</button>
        <button class="button info-button">ℹ️</button>
        <button class="button like-button">❤️</button>
      </div>
    </div>
  </div>
  
  <div class="navigation">
    <div class="nav-item active">
      <div class="icon">❤️</div>
      <div>Discover</div>
    </div>
    <div class="nav-item">
      <div class="icon">💬</div>
      <div>Matches</div>
    </div>
    <div class="nav-item">
      <div class="icon">📹</div>
      <div>Live</div>
    </div>
    <div class="nav-item">
      <div class="icon">👤</div>
      <div>Profile</div>
    </div>
  </div>

  <script>
    document.addEventListener('DOMContentLoaded', function() {
      // Initialize Telegram WebApp
      const tg = window.Telegram.WebApp;
      
      // Tell Telegram we're ready
      tg.ready();
      
      // Expand the WebApp
      tg.expand();
      
      // Apply theme based on Telegram theme
      if (tg.colorScheme === 'dark') {
        document.body.classList.add('dark-theme');
      }
      
      // Get user data
      const user = tg.initDataUnsafe?.user;
      if (user) {
        console.log('Telegram user:', user);
      }
      
      // Set up main button
      tg.MainButton.setText('Open Amoo App');
      tg.MainButton.onClick(function() {
        // In a real app, this would navigate to the full app or perform an action