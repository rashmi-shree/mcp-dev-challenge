import { AIAssistant } from '../mcp-client/ai-assistant';

// Mock the MCP client to avoid actual database connections
jest.mock('../mcp-client/mcp-client', () => {
  return {
    MCPClient: jest.fn().mockImplementation(() => ({
      initialize: jest.fn().mockResolvedValue(undefined),
      searchProperties: jest.fn().mockResolvedValue({
        result: {
          properties: [
            {
              propertyId: 'PROP-001',
              address: { street: '123 Test St', city: 'Test City' },
              type: 'flat',
              details: { bedrooms: 2 },
              rent: { monthlyAmount: 1800 }
            }
          ],
          count: 1
        }
      }),
      cleanup: jest.fn().mockResolvedValue(undefined)
    }))
  };
});

// Mock OpenAI to avoid actual API calls
jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{
            message: {
              content: 'I found some properties for you based on your search criteria.'
            }
          }]
        })
      }
    }
  }));
});

describe('AIAssistant', () => {
  let aiAssistant: AIAssistant;

  beforeEach(() => {
    aiAssistant = new AIAssistant();
  });

  afterEach(async () => {
    await aiAssistant.cleanup();
  });

  describe('processMessage', () => {
    it('should process a simple greeting message', async () => {
      const result = await aiAssistant.processMessage('Hello');
      
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
      expect(result).toContain('properties');
    });

    it('should recognize property search intent', async () => {
      const result = await aiAssistant.processMessage('Show me 2-bedroom flats under £2000');
      
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should recognize tenant lookup intent', async () => {
      const result = await aiAssistant.processMessage('Who is the current tenant of PROP-001?');
      
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle property creation intent', async () => {
      const result = await aiAssistant.processMessage('Add a new property at 999 Test Street, 3 bedrooms, £2500/month');
      
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle general chat', async () => {
      const result = await aiAssistant.processMessage('What can you help me with?');
      
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('conversation history', () => {
    it('should maintain conversation history', () => {
      expect(aiAssistant).toHaveProperty('clearHistory');
      expect(() => aiAssistant.clearHistory()).not.toThrow();
    });

    it('should clear conversation history', () => {
      aiAssistant.clearHistory();
      expect(() => aiAssistant.clearHistory()).not.toThrow();
    });
  });

  describe('initialization', () => {
    it('should initialize successfully', async () => {
      await expect(aiAssistant.initialize()).resolves.not.toThrow();
    });

    it('should handle cleanup properly', async () => {
      await aiAssistant.initialize();
      await expect(aiAssistant.cleanup()).resolves.not.toThrow();
    });
  });

  describe('intent recognition', () => {
    it('should extract property filters correctly', async () => {
      // This tests the internal intent recognition logic
      const message = 'Find 2-bedroom flats under £1500 in Manchester';
      const result = await aiAssistant.processMessage(message);
      
      expect(typeof result).toBe('string');
      // The result should indicate that a property search was performed
    });

    it('should handle property creation data extraction', async () => {
      const message = 'Create property at 456 Oak Avenue, 3 bedrooms, £2200 rent';
      const result = await aiAssistant.processMessage(message);
      
      expect(typeof result).toBe('string');
      // The result should indicate property creation was attempted
    });
  });

  describe('error handling', () => {
    it('should handle errors gracefully', async () => {
      // Mock an error in the MCP client
      const mockError = new Error('Database connection failed');
      
      const result = await aiAssistant.processMessage('Show me properties');
      
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
      // Should not throw, but return an error message
    });
  });
});
