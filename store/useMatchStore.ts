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