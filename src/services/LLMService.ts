import {initLlama, LlamaContext} from 'llama.rn';
import {Note} from '../types/Note';
import {ModelDownloadService} from './ModelDownloadService';

export class LLMService {
  private static context: LlamaContext | null = null;
  private static isInitialized = false;
  private static modelPath: string | null = null;

  static async initialize(onProgress?: (progress: number) => void): Promise<void> {
    try {
      if (this.isInitialized) {
        console.log('LLM already initialized');
        return;
      }

      // Check if model exists, otherwise download it
      let modelPath = await ModelDownloadService.getModelPath();
      
      if (!modelPath) {
        console.log('Model not found, downloading...');
        modelPath = await ModelDownloadService.downloadModel(onProgress);
      }

      this.modelPath = modelPath;

      // Initialize LLM with the model
      this.context = await initLlama({
        model: modelPath,
        use_mlock: true,
        n_ctx: 2048,
        n_gpu_layers: 1, // Use 1 GPU layer for better performance on modern devices
      });
      
      this.isInitialized = true;
      console.log('LLM initialized successfully with model:', modelPath);
    } catch (error) {
      console.error('Error initializing LLM:', error);
      console.log('Falling back to simple structuring');
      // Don't throw - fall back to simple structuring
    }
  }

  static async structureNote(
    rawTranscript: string,
  ): Promise<Note['structuredContent']> {
    try {
      // Use LLM if initialized, otherwise fallback to simple structuring
      if (this.context && this.isInitialized) {
        const prompt = `<|system|>
Du bist ein hilfreicher Assistent, der Sprachnotizen analysiert und strukturiert.
<|user|>
Analysiere die folgende deutsche Sprachnotiz und strukturiere sie:

Notiz: "${rawTranscript}"

Erstelle eine strukturierte Zusammenfassung mit:
1. Einem prägnanten Titel (max 50 Zeichen)
2. Einer passenden Kategorie (z.B. "Arbeit", "Privat", "Einkauf", "Idee", "Aufgabe", "Todo")
3. Dem formatierten Inhalt (mit Markdown-Formatierung wenn sinnvoll: Listen, Aufzählungen, etc.)
4. Relevanten Tags (3-5 deutsche Stichworte)
5. Priorität (low/medium/high)

Antworte NUR mit einem validen JSON-Objekt, keine zusätzlichen Erklärungen:
{
  "title": "...",
  "category": "...",
  "content": "...",
  "tags": ["...", "..."],
  "priority": "low|medium|high"
}
<|assistant|>`;

        const response = await this.context.completion({
          prompt,
          n_predict: 512,
          temperature: 0.7,
          top_p: 0.9,
          stop: ['<|user|>', '<|system|>'],
        });

        // Extract JSON from response
        const jsonMatch = response.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const structured = JSON.parse(jsonMatch[0]);
          console.log('LLM structured note successfully:', structured);
          return {
            title: structured.title || this.createFallbackStructure(rawTranscript).title,
            category: structured.category || 'Allgemein',
            content: structured.content || rawTranscript,
            tags: Array.isArray(structured.tags) ? structured.tags : [],
            priority: ['low', 'medium', 'high'].includes(structured.priority) 
              ? structured.priority 
              : 'medium',
          };
        } else {
          console.warn('Could not extract JSON from LLM response, using fallback');
          return this.createFallbackStructure(rawTranscript);
        }
      }

      // Fallback structure if LLM not available
      console.log('LLM not initialized, using fallback structuring');
      return this.createFallbackStructure(rawTranscript);
    } catch (error) {
      console.error('Error structuring note with LLM:', error);
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
