import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMatchStore } from '@/store/useMatchStore';
import MatchItem from '@/components/MatchItem';
import EmptyState from '@/components/EmptyState';
import Colors from '@/constants/colors';
import { MessageCircle } from 'lucide-react-native';

export default function MatchesScreen() {
  const { matches, loadMatches } = useMatchStore();
  
  useEffect(() => {
    loadMatches();
  }, []);
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {matches.length > 0 ? (
        <FlatList
          data={matches}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MatchItem match={item} />}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <EmptyState
          title="No matches yet"
          message="When you match with other users, they'll appear here. Start swiping to find your matches!"
          icon={<MessageCircle size={60} color={Colors.primary} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    flexGrow: 1,
  },
});