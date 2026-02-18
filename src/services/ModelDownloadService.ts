import RNFS from 'react-native-fs';

export interface ModelInfo {
  name: string;
  url: string;
  size: number;
  filename: string;
}

export class ModelDownloadService {
  // TinyLlama 1.1B quantisiert (Q4_K_M) - ca. 650MB
  private static readonly DEFAULT_MODEL: ModelInfo = {
    name: 'TinyLlama 1.1B Chat (Q4)',
    url: 'https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF/resolve/main/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf',
    size: 669097984, // ~650MB
    filename: 'tinyllama-chat.gguf',
  };

  private static readonly MODEL_DIR = `${RNFS.DocumentDirectoryPath}/models`;

  static async initialize(): Promise<string> {
    try {
      // Ensure model directory exists
      const dirExists = await RNFS.exists(this.MODEL_DIR);
      if (!dirExists) {
        await RNFS.mkdir(this.MODEL_DIR);
      }

      const modelPath = `${this.MODEL_DIR}/${this.DEFAULT_MODEL.filename}`;
      const modelExists = await RNFS.exists(modelPath);

      if (modelExists) {
        console.log('Model already downloaded:', modelPath);
        return modelPath;
      }

      console.log('Model not found, downloading...');
      return await this.downloadModel();
    } catch (error) {
      console.error('Error initializing model:', error);
      throw error;
    }
  }

  static async downloadModel(
    onProgress?: (progress: number) => void,
  ): Promise<string> {
    const modelPath = `${this.MODEL_DIR}/${this.DEFAULT_MODEL.filename}`;

    try {
      console.log('Starting download:', this.DEFAULT_MODEL.url);

      const downloadResult = await RNFS.downloadFile({
        fromUrl: this.DEFAULT_MODEL.url,
        toFile: modelPath,
        progressDivider: 10,
        begin: (res) => {
          console.log('Download started:', res);
        },
        progress: (res) => {
          const progress = (res.bytesWritten / res.contentLength) * 100;
          console.log(`Download progress: ${progress.toFixed(1)}%`);
          if (onProgress) {
            onProgress(progress);
          }
        },
      }).promise;

      if (downloadResult.statusCode === 200) {
        console.log('Model downloaded successfully:', modelPath);
        return modelPath;
      } else {
        throw new Error(`Download failed with status: ${downloadResult.statusCode}`);
      }
    } catch (error) {
      console.error('Error downloading model:', error);
      // Clean up partial download
      const exists = await RNFS.exists(modelPath);
      if (exists) {
        await RNFS.unlink(modelPath);
      }
      throw error;
    }
  }

  static async getModelPath(): Promise<string | null> {
    const modelPath = `${this.MODEL_DIR}/${this.DEFAULT_MODEL.filename}`;
    const exists = await RNFS.exists(modelPath);
    return exists ? modelPath : null;
  }

  static async deleteModel(): Promise<void> {
    const modelPath = `${this.MODEL_DIR}/${this.DEFAULT_MODEL.filename}`;
    const exists = await RNFS.exists(modelPath);
    if (exists) {
      await RNFS.unlink(modelPath);
      console.log('Model deleted:', modelPath);
    }
  }

  static async getModelInfo(): Promise<{
    exists: boolean;
    size?: number;
    path?: string;
  }> {
    const modelPath = `${this.MODEL_DIR}/${this.DEFAULT_MODEL.filename}`;
    const exists = await RNFS.exists(modelPath);

    if (exists) {
      const stat = await RNFS.stat(modelPath);
      return {
        exists: true,
        size: parseInt(stat.size, 10),
        path: modelPath,
      };
    }

    return {exists: false};
  }

  static getDefaultModelInfo(): ModelInfo {
    return this.DEFAULT_MODEL;
  }
}
