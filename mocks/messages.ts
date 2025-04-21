import { Message } from '@/types';

export const mockMessages: Record<string, Message[]> = {
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