import Voice from '@react-native-community/voice';

export class VoiceService {
  private static isListening = false;
  private static transcript = '';

  static async initialize(): Promise<void> {
    Voice.onSpeechStart = () => {
      console.log('Speech started');
      this.isListening = true;
    };

    Voice.onSpeechEnd = () => {
      console.log('Speech ended');
      this.isListening = false;
    };

    Voice.onSpeechResults = (event: any) => {
      if (event.value && event.value.length > 0) {
        this.transcript = event.value[0];
      }
    };

    Voice.onSpeechError = (error: any) => {
      console.error('Speech recognition error:', error);
      this.isListening = false;
    };
  }

  static async startListening(): Promise<void> {
    try {
      this.transcript = '';
      await Voice.start('de-DE'); // German language
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      throw error;
    }
  }

  static async stopListening(): Promise<string> {
    try {
      await Voice.stop();
      return this.transcript;
    } catch (error) {
      console.error('Error stopping voice recognition:', error);
      throw error;
    }
  }

  static async destroy(): Promise<void> {
    try {
      await Voice.destroy();
      Voice.removeAllListeners();
    } catch (error) {
      console.error('Error destroying voice service:', error);
    }
  }

  static getIsListening(): boolean {
    return this.isListening;
  }
}
