import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { User } from '@/types';
import { useUserStore } from '@/store/useUserStore';
import ProfileCard from '@/components/ProfileCard';
import NewMatchModal from '@/components/NewMatchModal';
import ProfileDetailModal from '@/components/ProfileDetailModal';
import EmptyState from '@/components/EmptyState';
import Colors from '@/constants/colors';
import { RefreshCw } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function DiscoverScreen() {
  const router = useRouter();
  const { 
    potentialMatches, 
    likeUser, 
    dislikeUser, 
    getNextPotentialMatches,
    isOnboarded,
    resetSwipes
  } = useUserStore();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedUser, setMatchedUser] = useState<User | null>(null);
  const [showProfileDetail, setShowProfileDetail] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  useEffect(() => {
    if (!isOnboarded) {
      router.push('/onboarding');
    } else {
      getNextPotentialMatches();
    }
  }, [isOnboarded]);
  
  const handleLike = () => {
    if (potentialMatches.length === 0) return;
    
    const user = potentialMatches[currentIndex];
    likeUser(user.id);
    
    // Simulate a match with 30% probability
    if (Math.random() < 0.3) {
      setMatchedUser(user);
      setShowMatchModal(true);
    }
    
    if (currentIndex < potentialMatches.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };
  
  const handleDislike = () => {
    if (potentialMatches.length === 0) return;
    
    const user = potentialMatches[currentIndex];
    dislikeUser(user.id);
    
    if (currentIndex < potentialMatches.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };
  
  const handleInfoPress = () => {
    if (potentialMatches.length === 0) return;
    
    setSelectedUser(potentialMatches[currentIndex]);
    setShowProfileDetail(true);
  };
  
  const handleMessageMatch = () => {
    setShowMatchModal(false);
    // Navigate to chat with the matched user
    if (matchedUser) {
      router.push('/matches');
    }
  };
  
  const handleRefresh = () => {
    resetSwipes();
    getNextPotentialMatches();
  };
  
  const currentUser = potentialMatches.length > 0 && currentIndex < potentialMatches.length 
    ? potentialMatches[currentIndex] 
    : null;
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {potentialMatches.length > 0 && currentUser ? (
        <View style={styles.cardContainer}>
          <ProfileCard 
            user={currentUser}
            onLike={handleLike}
            onDislike={handleDislike}
            onInfo={handleInfoPress}
          />
        </View>
      ) : (
        <EmptyState
          title="No more profiles"
          message="We've run out of profiles to show you. Check back later or adjust your preferences."
          actionLabel="Refresh"
          onAction={handleRefresh}
          icon={<RefreshCw size={60} color={Colors.primary} />}
        />
      )}
      
      <NewMatchModal
        visible={showMatchModal}
        user={matchedUser}
        onClose={() => setShowMatchModal(false)}
        onMessage={handleMessageMatch}
      />
      
      <ProfileDetailModal
        visible={showProfileDetail}
        user={selectedUser}
        onClose={() => setShowProfileDetail(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
  },
});