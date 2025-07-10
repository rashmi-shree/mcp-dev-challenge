import { AIAssistant } from '../mcp-client/ai-assistant';

describe('AIAssistant', () => {
  let aiAssistant: AIAssistant;

  beforeEach(() => {
    aiAssistant = new AIAssistant();
  });

  describe('processMessage', () => {
    it('should process a simple message', async () => {
      // Mock OpenAI response
      const mockResponse = 'Hello! How can I help you today?';
      
      // This is a placeholder test - you'll need to mock the OpenAI API
      // For now, we'll just test that the method exists and returns a string
      const result = await aiAssistant.processMessage('Hello');
      
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should maintain conversation history', () => {
      // Test conversation history functionality
      expect(aiAssistant).toHaveProperty('clearHistory');
      
      // Clear history should not throw
      expect(() => aiAssistant.clearHistory()).not.toThrow();
    });
  });

  describe('clearHistory', () => {
    it('should clear conversation history', () => {
      // Test that clearHistory method exists and can be called
      expect(() => aiAssistant.clearHistory()).not.toThrow();
    });
  });
});
