export interface RuntimeConfig {
  aiProvider: string;
  ollamaBaseUrl: string;
  ollamaModel: string;
  openAiModel: string;
  awsRegion: string;
  bedrockModelId: string;
  huggingFaceModel: string;
}

export interface AiProviderModels {
  models: Record<string, string[]>;
}
