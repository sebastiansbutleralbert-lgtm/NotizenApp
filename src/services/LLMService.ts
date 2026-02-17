import {initLlama, LlamaContext} from 'llama.rn';
import {Note} from '../types/Note';

export class LLMService {
  private static context: LlamaContext | null = null;
  private static isInitialized = false;

  static async initialize(modelPath: string): Promise<void> {
    try {
      if (!this.isInitialized) {
        this.context = await initLlama({
          model: modelPath,
          use_mlock: true,
          n_ctx: 2048,
          n_gpu_layers: 0, // CPU only for now, can be increased for GPU
        });
        this.isInitialized = true;
        console.log('LLM initialized successfully');
      }
    } catch (error) {
      console.error('Error initializing LLM:', error);
      throw error;
    }
  }

  static async structureNote(
    rawTranscript: string,
  ): Promise<Note['structuredContent']> {
    try {
      // For now, return a placeholder structure
      // In production, this would call the LLM to analyze the transcript
      
      const prompt = `Analysiere die folgende Sprachnotiz und strukturiere sie:

Notiz: "${rawTranscript}"

Erstelle eine strukturierte Zusammenfassung mit:
1. Einem prägnanten Titel (max 50 Zeichen)
2. Einer passenden Kategorie (z.B. "Arbeit", "Privat", "Einkauf", "Idee", "Aufgabe")
3. Dem formatierten Inhalt
4. Relevanten Tags (3-5 Stichworte)
5. Priorität (low/medium/high)

Antworte nur mit einem JSON-Objekt im folgenden Format:
{
  "title": "...",
  "category": "...",
  "content": "...",
  "tags": [...],
  "priority": "..."
}`;

      // Placeholder implementation - will be replaced with actual LLM call
      // when model is properly integrated
      if (this.context && this.isInitialized) {
        // const response = await this.context.completion({
        //   prompt,
        //   n_predict: 256,
        //   temperature: 0.7,
        // });
        // return JSON.parse(response.text);
      }

      // Fallback structure for development
      return this.createFallbackStructure(rawTranscript);
    } catch (error) {
      console.error('Error structuring note:', error);
      return this.createFallbackStructure(rawTranscript);
    }
  }

  private static createFallbackStructure(
    rawTranscript: string,
  ): Note['structuredContent'] {
    // Simple fallback: create basic structure from transcript
    const words = rawTranscript.split(' ');
    const title =
      words.slice(0, 5).join(' ') +
      (words.length > 5 ? '...' : '');

    return {
      title,
      category: 'Allgemein',
      content: rawTranscript,
      tags: this.extractSimpleTags(rawTranscript),
      priority: 'medium',
    };
  }

  private static extractSimpleTags(text: string): string[] {
    // Simple keyword extraction (can be improved)
    const keywords = new Set<string>();
    const commonWords = new Set([
      'der',
      'die',
      'das',
      'und',
      'oder',
      'aber',
      'ich',
      'du',
      'er',
      'sie',
      'es',
      'wir',
      'ihr',
      'ist',
      'sind',
      'war',
      'waren',
      'ein',
      'eine',
      'für',
      'mit',
      'auf',
      'von',
      'zu',
      'in',
    ]);

    const words = text.toLowerCase().split(/\s+/);
    words.forEach(word => {
      const cleaned = word.replace(/[^\wäöüß]/g, '');
      if (
        cleaned.length > 3 &&
        !commonWords.has(cleaned) &&
        keywords.size < 5
      ) {
        keywords.add(cleaned);
      }
    });

    return Array.from(keywords);
  }

  static async release(): Promise<void> {
    if (this.context) {
      // Release LLM context
      this.context = null;
      this.isInitialized = false;
    }
  }
}
