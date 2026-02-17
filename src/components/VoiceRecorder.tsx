import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {FAB, Text, Portal, Modal, ActivityIndicator} from 'react-native-paper';
import {VoiceService} from '../services/VoiceService';
import {LLMService} from '../services/LLMService';
import {StorageService} from '../services/StorageService';
import {Note} from '../types/Note';

export const VoiceRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    VoiceService.initialize();
    return () => {
      VoiceService.destroy();
    };
  }, []);

  const handleStartRecording = async () => {
    try {
      await VoiceService.startListening();
      setIsRecording(true);
    } catch (error) {
      Alert.alert('Fehler', 'Sprachaufnahme konnte nicht gestartet werden');
      console.error(error);
    }
  };

  const handleStopRecording = async () => {
    try {
      setIsRecording(false);
      setIsProcessing(true);

      const transcript = await VoiceService.stopListening();

      if (!transcript || transcript.trim().length === 0) {
        Alert.alert('Hinweis', 'Keine Sprache erkannt');
        setIsProcessing(false);
        return;
      }

      // Structure the note using LLM
      const structuredContent = await LLMService.structureNote(transcript);

      // Create and save the note
      const note: Note = {
        id: Date.now().toString(),
        timestamp: new Date(),
        rawTranscript: transcript,
        structuredContent,
        processingStatus: 'completed',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await StorageService.saveNote(note);

      Alert.alert(
        'Notiz gespeichert',
        `Titel: ${structuredContent.title}\nKategorie: ${structuredContent.category}`,
      );
    } catch (error) {
      Alert.alert('Fehler', 'Notiz konnte nicht verarbeitet werden');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <FAB
        icon={isRecording ? 'stop' : 'microphone'}
        label={isRecording ? 'Aufnahme stoppen' : 'Aufnehmen'}
        onPress={isRecording ? handleStopRecording : handleStartRecording}
        style={[
          styles.fab,
          isRecording ? styles.fabRecording : styles.fabIdle,
        ]}
        color="white"
      />

      <Portal>
        <Modal
          visible={isProcessing}
          dismissable={false}
          contentContainerStyle={styles.modal}>
          <ActivityIndicator size="large" />
          <Text style={styles.modalText}>
            Notiz wird verarbeitet und strukturiert...
          </Text>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  fabIdle: {
    backgroundColor: '#6200ee',
  },
  fabRecording: {
    backgroundColor: '#d32f2f',
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalText: {
    marginTop: 16,
    fontSize: 16,
  },
});
