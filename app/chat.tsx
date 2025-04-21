import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack, useNavigation } from 'expo-router';
import { Send, ArrowLeft } from 'lucide-react-native';
import { useMatchStore } from '@/store/useMatchStore';
import { mockUsers } from '@/mocks/users';
import MessageBubble from '@/components/MessageBubble';
import Colors from '@/constants/colors';

export default function ChatScreen() {
  const { matchId } = useLocalSearchParams();
  const navigation = useNavigation();
  const { messages, matches, loadMessages, sendMessage, markAsRead } = useMatchStore();
  const [text, setText] = useState('');
  const flatListRef = useRef<FlatList>(null);
  
  const match = matches.find(m => m.id === matchId);
  const user = match ? mockUsers.find(u => u.id === match.userId) : null;
  const matchMessages = messages[matchId as string] || [];
  
  useEffect(() => {
    if (matchId) {
      loadMessages(matchId as string);
      markAsRead(matchId as string);
    }
  }, [matchId]);
  
  const handleSend = () => {
    if (!text.trim() || !matchId) return;
    
    sendMessage(matchId as string, text);
    setText('');
    
    // Scroll to bottom after sending
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };
  
  if (!user || !match) return null;
  
  return (
    <>
      <Stack.Screen 
        options={{
          headerTitle: () => (
            <View style={styles.headerTitle}>
              <Image source={{ uri: user.photos[0] }} style={styles.avatar} />
              <View>
                <Text style={styles.headerName}>{user.name}</Text>
                {user.lastActive === 'Just now' ? (
                  <Text style={styles.onlineStatus}>Online</Text>
                ) : (
                  <Text style={styles.lastActive}>{user.lastActive}</Text>
                )}
              </View>
            </View>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ArrowLeft size={24} color={Colors.text} />
            </TouchableOpacity>
          ),
          headerStyle: styles.header,
        }}
      />
      
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoid}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <FlatList
            ref={flatListRef}
            data={matchMessages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <MessageBubble 
                message={item} 
                isCurrentUser={item.senderId === 'current'} 
              />
            )}
            contentContainerStyle={styles.messagesList}
            onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
          />
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              value={text}
              onChangeText={setText}
              multiline
            />
            <TouchableOpacity 
              style={[styles.sendButton, !text.trim() && styles.sendButtonDisabled]} 
              onPress={handleSend}
              disabled={!text.trim()}
            >
              <Send size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.background,
    shadowColor: 'transparent',
    elevation: 0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  onlineStatus: {
    fontSize: 12,
    color: Colors.success,
  },
  lastActive: {
    fontSize: 12,
    color: Colors.subtext,
  },
  keyboardAvoid: {
    flex: 1,
  },
  messagesList: {
    flexGrow: 1,
    padding: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 120,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: Colors.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: Colors.inactive,
  },
});