// app/(app)/search.tsx

import { UserSummary, searchUsers, sendFriendRequest } from '@/services/users';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import debounce from 'lodash.debounce';
import { useToast } from 'react-native-toast-notifications';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // Debounce pour éviter trop d'appels API
  const doSearch = useCallback(
    debounce(async (q: string) => {
      if (q.length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const { users } = await searchUsers(q);
        setResults(users);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  const onChange = (text: string) => {
    setQuery(text);
    doSearch(text);
  };

  const handleAddFriend = async (userId: string) => {
    try {
      await sendFriendRequest(userId);
      toast.show('Demande envoyée !', { type: 'success' });
    } catch (err: any) {
      toast.show(err.message || 'Erreur', { type: 'warning' });
    }
  };

  const renderItem = ({ item }: { item: UserSummary }) => (
    <View style={styles.item}>
      <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.username}</Text>
        <Text style={styles.email}>{item.email}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => handleAddFriend(item.id)}>
        <Text style={styles.buttonText}>Ajouter</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Rechercher un ami…"
        value={query}
        onChangeText={onChange}
        style={styles.searchInput}
        autoCapitalize="none"
      />
      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={i => i.id}
          renderItem={renderItem}
          ListEmptyComponent={() => query.length >= 2 && <Text style={styles.empty}>Aucun résultat</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  searchInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12 },
  item: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#eee' },
  info: { flex: 1, marginHorizontal: 12 },
  name: { fontSize: 16, fontWeight: 'bold' },
  email: { fontSize: 14, color: '#666' },
  button: { backgroundColor: '#007AFF', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 4 },
  buttonText: { color: '#fff' },
  empty: { textAlign: 'center', marginTop: 20, color: '#888' },
});
