import React from 'react';
import { View, Text, StyleSheet, Modal, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MessageCircle, X, Send } from 'lucide-react-native';
import { User } from '@/types';
import Colors from '@/constants/colors';
import TelegramShare from './TelegramShare';

interface NewMatchModalProps {
  visible: boolean;
  user: User | null;
  onClose: () => void;
  onMessage: () => void;
}

const NewMatchModal: React.FC<NewMatchModalProps> = ({ visible, user, onClose, onMessage }) => {
  if (!user) return null;
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <LinearGradient
            colors={[Colors.gradient.start, Colors.gradient.end]}
            style={styles.header}
          >
            <Text style={styles.matchText}>It's a Match!</Text>
            <Text style={styles.subText}>You and {user.name} liked each other</Text>
          </LinearGradient>
          
          <View style={styles.profileContainer}>
            <Image source={{ uri: user.photos[0] }} style={styles.profileImage} />
            <Text style={styles.name}>{user.name}, {user.age}</Text>
            <Text style={styles.location}>{user.location}</Text>
          </View>
          
          <TouchableOpacity style={styles.messageButton} onPress={onMessage}>
            <MessageCircle size={20} color="#FFFFFF" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Send a Message</Text>
          </TouchableOpacity>
          
          <View style={styles.shareContainer}>
            <TelegramShare 
              user={user} 
              customMessage={`I just matched with ${user.name} on Amoo Dating App! Check it out!`} 
            />
          </View>
          
          <TouchableOpacity style={styles.keepSwipingButton} onPress={onClose}>
            <Text style={styles.keepSwipingText}>Keep Swiping</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    backgroundColor: Colors.background,
    borderRadius: 20,
    overflow: 'hidden',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  header: {
    width: '100%',
    paddingVertical: 24,
    alignItems: 'center',
  },
  matchText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  profileContainer: {
    alignItems: 'center',
    padding: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  location: {
    fontSize: 16,
    color: Colors.subtext,
  },
  messageButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    marginBottom: 12,
  },
  shareContainer: {
    width: '80%',
    marginBottom: 12,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  keepSwipingButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    marginBottom: 24,
  },
  keepSwipingText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NewMatchModal;