import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Share, Platform } from 'react-native';
import { Send } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { User } from '@/types';

interface TelegramShareProps {
  user?: User;
  customMessage?: string;
}

const TelegramShare: React.FC<TelegramShareProps> = ({ user, customMessage }) => {
  const shareToTelegram = async () => {
    try {
      const message = customMessage || 
        (user ? 
          `Check out ${user.name}'s profile on Amoo Dating App! They're ${user.age} years old and into ${user.interests.join(', ')}.` : 
          "Check out Amoo Dating App!");
      
      // For iOS, we can use the Telegram URL scheme
      if (Platform.OS === 'ios') {
        const url = `tg://msg?text=${encodeURIComponent(message)}`;
        await Share.share({
          url,
        });
      } else {
        // For Android and Web
        await Share.share({
          message,
        });
      }
    } catch (error) {
      console.error('Error sharing to Telegram:', error);
    }
  };

  return (
    <TouchableOpacity style={styles.shareButton} onPress={shareToTelegram}>
      <Send size={18} color="#FFFFFF" style={styles.icon} />
      <Text style={styles.shareText}>Share via Telegram</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginVertical: 10,
  },
  icon: {
    marginRight: 8,
  },
  shareText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TelegramShare;