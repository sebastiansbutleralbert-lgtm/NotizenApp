export interface Note {
  id: string;
  timestamp: Date;
  rawTranscript: string;
  structuredContent: {
    title: string;
    category: string;
    content: string;
    tags: string[];
    priority?: 'low' | 'medium' | 'high';
  };
  audioPath?: string;
  processingStatus: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
}
