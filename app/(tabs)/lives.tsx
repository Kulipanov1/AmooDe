import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Users, Eye, Heart, X } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { mockLiveStreams } from '@/mocks/liveStreams';
import LiveStreamModal from '@/components/LiveStreamModal';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width / 2 - 24;

export default function LivesScreen() {
  const [selectedStream, setSelectedStream] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  const handleStreamPress = (stream) => {
    setSelectedStream(stream);
    setModalVisible(true);
  };
  
  const renderLiveStream = ({ item }) => (
    <TouchableOpacity 
      style={styles.streamCard}
      onPress={() => handleStreamPress(item)}
    >
      <Image source={{ uri: item.thumbnailUrl }} style={styles.thumbnail} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}
      >
        <View style={styles.liveIndicator}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
        
        <View style={styles.streamInfo}>
          <Text style={styles.hostName}>{item.hostName}</Text>
          <Text style={styles.streamTitle} numberOfLines={1}>{item.title}</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Eye size={12} color="#FFFFFF" />
              <Text style={styles.statText}>{item.viewerCount}</Text>
            </View>
            <View style={styles.statItem}>
              <Heart size={12} color="#FFFFFF" />
              <Text style={styles.statText}>{item.likeCount}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Live Now</Text>
        <TouchableOpacity style={styles.goLiveButton}>
          <Text style={styles.goLiveText}>Go Live</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={mockLiveStreams}
        renderItem={renderLiveStream}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.columnWrapper}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Users size={60} color={Colors.primary} />
            <Text style={styles.emptyTitle}>No Live Streams</Text>
            <Text style={styles.emptyMessage}>
              There are no live streams at the moment. Check back later or start your own!
            </Text>
          </View>
        }
      />
      
      <LiveStreamModal
        visible={modalVisible}
        stream={selectedStream}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  goLiveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  goLiveText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  listContent: {
    padding: 12,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  streamCard: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.5,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#F0F0F0',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    padding: 12,
    justifyContent: 'space-between',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    marginRight: 4,
  },
  liveText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  streamInfo: {
    width: '100%',
  },
  hostName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  streamTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    marginBottom: 6,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  statText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    color: Colors.subtext,
    textAlign: 'center',
    lineHeight: 22,
  },
});