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