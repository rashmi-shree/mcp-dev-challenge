import { config } from '../server/config';

describe('Configuration', () => {
  it('should load configuration values', () => {
    expect(config).toBeDefined();
    expect(config.socketPort).toBeDefined();
    expect(config.openai).toBeDefined();
    expect(config.mongodb).toBeDefined();
  });

  it('should have required OpenAI configuration', () => {
    expect(config.openai.model).toBe('gpt-3.5-turbo');
    expect(config.openai.maxTokens).toBe(1500);
    expect(typeof config.openai.apiKey).toBe('string');
  });

  it('should have MongoDB configuration', () => {
    expect(config.mongodb.uri).toContain('mongodb://');
    expect(config.mongodb.dbName).toBeDefined();
  });

  it('should have server ports defined', () => {
    expect(typeof config.socketPort).toBe('number');
    expect(config.socketPort).toBeGreaterThan(0);
  });
});
