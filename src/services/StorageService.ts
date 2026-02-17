import AsyncStorage from '@react-native-async-storage/async-storage';
import {Note} from '../types/Note';

const NOTES_STORAGE_KEY = '@voice_notes_app:notes';

export class StorageService {
  static async saveNote(note: Note): Promise<void> {
    try {
      const notes = await this.getAllNotes();
      const updatedNotes = [...notes, note];
      await AsyncStorage.setItem(
        NOTES_STORAGE_KEY,
        JSON.stringify(updatedNotes),
      );
    } catch (error) {
      console.error('Error saving note:', error);
      throw error;
    }
  }

  static async getAllNotes(): Promise<Note[]> {
    try {
      const notesJson = await AsyncStorage.getItem(NOTES_STORAGE_KEY);
      if (!notesJson) return [];
      
      const notes = JSON.parse(notesJson);
      // Convert date strings back to Date objects
      return notes.map((note: any) => ({
        ...note,
        timestamp: new Date(note.timestamp),
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt),
      }));
    } catch (error) {
      console.error('Error loading notes:', error);
      return [];
    }
  }

  static async updateNote(noteId: string, updates: Partial<Note>): Promise<void> {
    try {
      const notes = await this.getAllNotes();
      const updatedNotes = notes.map(note =>
        note.id === noteId
          ? {...note, ...updates, updatedAt: new Date()}
          : note,
      );
      await AsyncStorage.setItem(
        NOTES_STORAGE_KEY,
        JSON.stringify(updatedNotes),
      );
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  }

  static async deleteNote(noteId: string): Promise<void> {
    try {
      const notes = await this.getAllNotes();
      const filteredNotes = notes.filter(note => note.id !== noteId);
      await AsyncStorage.setItem(
        NOTES_STORAGE_KEY,
        JSON.stringify(filteredNotes),
      );
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  }
}
