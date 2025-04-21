import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, X, Info } from 'lucide-react-native';
import { User } from '@/types';
import Colors from '@/constants/colors';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;

interface ProfileCardProps {
  user: User;
  onLike: () => void;
  onDislike: () => void;
  onInfo: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user, onLike, onDislike, onInfo }) => {
  return (
    <View style={styles.card}>
      <Image 
        source={{ uri: user.photos[0] }} 
        style={styles.image}
        resizeMode="cover"
      />
      
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}
      >
        <View style={styles.userInfo}>
          <Text style={styles.name}>{user.name}, {user.age}</Text>
          <Text style={styles.location}>{user.location} • {user.distance} miles away</Text>
          
          <View style={styles.interestsContainer}>
            {user.interests.slice(0, 3).map((interest, index) => (
              <View key={index} style={styles.interestBadge}>
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
            {user.interests.length > 3 && (
              <View style={styles.interestBadge}>
                <Text style={styles.interestText}>+{user.interests.length - 3}</Text>
              </View>
            )}
          </View>
        </View>
      </LinearGradient>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={[styles.actionButton, styles.dislikeButton]} onPress={onDislike}>
          <X size={30} color="#FF3B30" />
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.actionButton, styles.infoButton]} onPress={onInfo}>
          <Info size={24} color="#007AFF" />
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.actionButton, styles.likeButton]} onPress={onLike}>
          <Heart size={30} color="#34C759" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.5,
    borderRadius: 20,
    backgroundColor: Colors.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    justifyContent: 'flex-end',
    padding: 20,
  },
  userInfo: {
    marginBottom: 60,
  },
  name: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  location: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 12,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  interestBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  interestText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  actionsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: 10,
  },
  likeButton: {
    backgroundColor: '#FFFFFF',
  },
  dislikeButton: {
    backgroundColor: '#FFFFFF',
  },
  infoButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
  },
});

export default ProfileCard;