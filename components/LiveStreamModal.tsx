import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  Image, 
  TouchableOpacity, 
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Dimensions
} from 'react-native';
import { X, Heart, Send, Gift, Users } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';

const { height } = Dimensions.get('window');

const mockComments = [
  { id: '1', username: 'Sarah', text: 'Hey everyone! Just joined 👋', timestamp: '2 min ago' },
  { id: '2', username: 'Mike', text: 'You look amazing today!', timestamp: '1 min ago' },
  { id: '3', username: 'Jessica', text: 'Where did you get that shirt?', timestamp: '45 sec ago' },
  { id: '4', username: 'David', text: '❤️❤️❤️', timestamp: '30 sec ago' },
  { id: '5', username: 'Emma', text: 'Can you show us your apartment?', timestamp: '15 sec ago' },
];

const LiveStreamModal = ({ visible, stream, onClose }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(mockComments);
  const [liked, setLiked] = useState(false);
  
  if (!stream) return null;
  
  const handleSendComment = () => {
    if (!comment.trim()) return;
    
    const newComment = {
      id: Date.now().toString(),
      username: 'You',
      text: comment,
      timestamp: 'Just now'
    };
    
    setComments([...comments, newComment]);
    setComment('');
  };
  
  const toggleLike = () => {
    setLiked(!liked);
  };
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
    >
      <View style={styles.container}>
        <Image source={{ uri: stream.thumbnailUrl }} style={styles.videoBackground} />
        
        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'transparent', 'rgba(0,0,0,0.7)']}
          style={styles.overlay}
        >
          <View style={styles.header}>
            <View style={styles.hostInfo}>
              <Image source={{ uri: stream.hostAvatar }} style={styles.hostAvatar} />
              <View>
                <Text style={styles.hostName}>{stream.hostName}</Text>
                <View style={styles.liveIndicator}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>LIVE</Text>
                </View>
              </View>
            </View>
            
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.viewerCount}>
            <Users size={16} color="#FFFFFF" />
            <Text style={styles.viewerCountText}>{stream.viewerCount}</Text>
          </View>
          
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.bottomContainer}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
          >
            <FlatList
              data={comments}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.commentItem}>
                  <Text style={styles.commentUsername}>{item.username}</Text>
                  <Text style={styles.commentText}>{item.text}</Text>
                </View>
              )}
              style={styles.commentsList}
              inverted={false}
            />
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Add a comment..."
                placeholderTextColor="#AAAAAA"
                value={comment}
                onChangeText={setComment}
              />
              
              <TouchableOpacity style={styles.iconButton} onPress={toggleLike}>
                <Heart size={24} color={liked ? Colors.primary : "#FFFFFF"} fill={liked ? Colors.primary : "none"} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.iconButton}>
                <Gift size={24} color="#FFFFFF" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.sendButton, !comment.trim() && styles.sendButtonDisabled]} 
                onPress={handleSendComment}
                disabled={!comment.trim()}
              >
                <Send size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </LinearGradient>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  videoBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
  },
  hostInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hostAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  hostName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  liveDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
    marginRight: 4,
  },
  liveText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewerCount: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 100 : 66,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  viewerCountText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginLeft: 4,
  },
  bottomContainer: {
    marginTop: 'auto',
  },
  commentsList: {
    maxHeight: height * 0.3,
    paddingHorizontal: 16,
  },
  commentItem: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
    maxWidth: '80%',
  },
  commentUsername: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  commentText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: '#FFFFFF',
    marginRight: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  sendButtonDisabled: {
    backgroundColor: 'rgba(255, 107, 107, 0.5)',
  },
});

export default LiveStreamModal;