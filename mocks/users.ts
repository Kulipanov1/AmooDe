import { User } from '@/types';

export const mockUsers: User[] = [
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