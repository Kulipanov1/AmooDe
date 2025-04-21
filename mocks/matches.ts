import { Match } from '@/types';

export const mockMatches: Match[] = [
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