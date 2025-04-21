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