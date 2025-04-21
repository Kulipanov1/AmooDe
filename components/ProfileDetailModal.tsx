import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { X, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { User } from '@/types';
import Colors from '@/constants/colors';
import TelegramShare from './TelegramShare';

const { width } = Dimensions.get('window');

interface ProfileDetailModalProps {
  visible: boolean;
  user: User | null;
  onClose: () => void;
}

const ProfileDetailModal: React.FC<ProfileDetailModalProps> = ({ visible, user, onClose }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  
  if (!user) return null;
  
  const nextPhoto = () => {
    if (currentPhotoIndex < user.photos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    }
  };
  
  const prevPhoto = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    }
  };
  
  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <X size={24} color={Colors.text} />
        </TouchableOpacity>
        
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.photoContainer}>
            <Image 
              source={{ uri: user.photos[currentPhotoIndex] }} 
              style={styles.photo}
              resizeMode="cover"
            />
            
            {user.photos.length > 1 && (
              <>
                {currentPhotoIndex > 0 && (
                  <TouchableOpacity style={[styles.photoNavButton, styles.leftButton]} onPress={prevPhoto}>
                    <ChevronLeft size={30} color="#FFFFFF" />
                  </TouchableOpacity>
                )}
                
                {currentPhotoIndex < user.photos.length - 1 && (
                  <TouchableOpacity style={[styles.photoNavButton, styles.rightButton]} onPress={nextPhoto}>
                    <ChevronRight size={30} color="#FFFFFF" />
                  </TouchableOpacity>
                )}
                
                <View style={styles.photoIndicators}>
                  {user.photos.map((_, index) => (
                    <View 
                      key={index} 
                      style={[
                        styles.photoIndicator, 
                        index === currentPhotoIndex && styles.activePhotoIndicator
                      ]} 
                    />
                  ))}
                </View>
              </>
            )}
          </View>
          
          <View style={styles.infoContainer}>
            <Text style={styles.name}>{user.name}, {user.age}</Text>
            <Text style={styles.location}>{user.location} • {user.distance} miles away</Text>
            
            {user.lastActive && (
              <Text style={styles.lastActive}>Active {user.lastActive}</Text>
            )}
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.bio}>{user.bio}</Text>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Interests</Text>
              <View style={styles.interestsContainer}>
                {user.interests.map((interest, index) => (
                  <View key={index} style={styles.interestBadge}>
                    <Text style={styles.interestText}>{interest}</Text>
                  </View>
                ))}
              </View>
            </View>
            
            <View style={styles.shareSection}>
              <TelegramShare user={user} />
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoContainer: {
    width: width,
    height: width * 1.3,
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoNavButton: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -25 }],
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftButton: {
    left: 10,
  },
  rightButton: {
    right: 10,
  },
  photoIndicators: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  photoIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  activePhotoIndicator: {
    backgroundColor: '#FFFFFF',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  infoContainer: {
    padding: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  location: {
    fontSize: 16,
    color: Colors.subtext,
    marginBottom: 8,
  },
  lastActive: {
    fontSize: 14,
    color: Colors.success,
    marginBottom: 16,
  },
  section: {
    marginTop: 24,
  },
  shareSection: {
    marginTop: 30,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  bio: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestBadge: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  interestText: {
    color: Colors.text,
    fontSize: 14,
  },
});

export default ProfileDetailModal;