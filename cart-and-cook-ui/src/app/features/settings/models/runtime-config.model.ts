export interface RuntimeConfig {
  dbUrl: string;
  dbUsername: string;
  dbPassword: string;
  oauth2IssuerUri: string;
  port: string;
  autoRestartOnConfigSave: boolean;

  aiProvider: string;
  ollamaBaseUrl: string;
  ollamaModel: string;
  openAiApiKey: string;
  openAiModel: string;
  awsRegion: string;
  bedrockModelId: string;
  huggingFaceApiKey: string;
  huggingFaceModel: string;

  restartRequired: boolean;
  restartRequiredKeys: string[];
}
