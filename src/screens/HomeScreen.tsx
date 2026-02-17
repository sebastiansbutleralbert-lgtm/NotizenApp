import React, {useState, useEffect} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {
  Appbar,
  Card,
  Chip,
  Text,
  Searchbar,
  Provider as PaperProvider,
} from 'react-native-paper';
import {StorageService} from '../services/StorageService';
import {VoiceRecorder} from '../components/VoiceRecorder';
import {Note} from '../types/Note';

export const HomeScreen: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);

  useEffect(() => {
    loadNotes();
    const interval = setInterval(loadNotes, 2000); // Refresh every 2 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterNotes();
  }, [notes, searchQuery]);

  const loadNotes = async () => {
    const loadedNotes = await StorageService.getAllNotes();
    setNotes(loadedNotes.sort((a, b) => 
      b.timestamp.getTime() - a.timestamp.getTime()
    ));
  };

  const filterNotes = () => {
    if (!searchQuery.trim()) {
      setFilteredNotes(notes);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = notes.filter(
      note =>
        note.structuredContent.title.toLowerCase().includes(query) ||
        note.structuredContent.content.toLowerCase().includes(query) ||
        note.structuredContent.category.toLowerCase().includes(query) ||
        note.structuredContent.tags.some(tag =>
          tag.toLowerCase().includes(query),
        ),
    );
    setFilteredNotes(filtered);
  };

  const renderNote = ({item}: {item: Note}) => (
    <Card style={styles.card}>
      <Card.Title
        title={item.structuredContent.title}
        subtitle={`${item.structuredContent.category} • ${item.timestamp.toLocaleDateString('de-DE')}`}
      />
      <Card.Content>
        <Text>{item.structuredContent.content}</Text>
        <View style={styles.tagContainer}>
          {item.structuredContent.tags.map((tag, index) => (
            <Chip key={index} style={styles.chip}>
              {tag}
            </Chip>
          ))}
        </View>
        {item.structuredContent.priority && (
          <Chip
            style={[
              styles.priorityChip,
              item.structuredContent.priority === 'high'
                ? styles.priorityHigh
                : item.structuredContent.priority === 'medium'
                ? styles.priorityMedium
                : styles.priorityLow,
            ]}>
            {item.structuredContent.priority === 'high'
              ? 'Hohe Priorität'
              : item.structuredContent.priority === 'medium'
              ? 'Mittlere Priorität'
              : 'Niedrige Priorität'}
          </Chip>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.Content title="Sprach-Notizen" />
        </Appbar.Header>

        <Searchbar
          placeholder="Notizen durchsuchen..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />

        {filteredNotes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {notes.length === 0
                ? 'Noch keine Notizen vorhanden.\nTippe auf das Mikrofon, um eine Notiz aufzunehmen!'
                : 'Keine Notizen gefunden.'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredNotes}
            renderItem={renderNote}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
          />
        )}

        <VoiceRecorder />
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchbar: {
    margin: 16,
    marginBottom: 8,
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
  },
  card: {
    marginBottom: 16,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  chip: {
    marginRight: 8,
    marginTop: 4,
  },
  priorityChip: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  priorityHigh: {
    backgroundColor: '#ffcdd2',
  },
  priorityMedium: {
    backgroundColor: '#fff9c4',
  },
  priorityLow: {
    backgroundColor: '#c8e6c9',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});
