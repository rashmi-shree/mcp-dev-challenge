import { MCPClient } from '../mcp-client/mcp-client';

describe('MCPClient', () => {
  let mcpClient: MCPClient;

  beforeEach(async () => {
    mcpClient = new MCPClient();
    // Don't initialize for unit tests to avoid actual DB connections
  });

  afterEach(async () => {
    await mcpClient.cleanup();
  });

  describe('searchProperties', () => {
    it('should create proper MCP request for property search', async () => {
      const filters = {
        bedrooms: 2,
        maxRent: 2000,
        status: 'available'
      };

      // Mock the sendRequest method to avoid actual MCP call
      const sendRequestSpy = jest.spyOn(mcpClient, 'sendRequest');
      sendRequestSpy.mockResolvedValue({
        result: {
          properties: [],
          count: 0,
          total: 0
        }
      });

      const response = await mcpClient.searchProperties(filters);

      expect(sendRequestSpy).toHaveBeenCalledWith('properties.search', filters);
      expect(response.result).toBeDefined();
      
      sendRequestSpy.mockRestore();
    });
  });

  describe('createProperty', () => {
    it('should create proper MCP request for property creation', async () => {
      const propertyData = {
        address: { street: 'Test Street', city: 'Test City' },
        type: 'flat',
        rent: { monthlyAmount: 1500 }
      };

      const sendRequestSpy = jest.spyOn(mcpClient, 'sendRequest');
      sendRequestSpy.mockResolvedValue({
        result: {
          propertyId: 'PROP-TEST',
          success: true
        }
      });

      const response = await mcpClient.createProperty(propertyData);

      expect(sendRequestSpy).toHaveBeenCalledWith('properties.create', propertyData);
      expect(response.result).toBeDefined();
      
      sendRequestSpy.mockRestore();
    });
  });

  describe('searchResidents', () => {
    it('should create proper MCP request for resident search', async () => {
      const filters = {
        propertyId: 'PROP-001',
        status: 'active'
      };

      const sendRequestSpy = jest.spyOn(mcpClient, 'sendRequest');
      sendRequestSpy.mockResolvedValue({
        result: {
          residents: [],
          count: 0,
          total: 0
        }
      });

      const response = await mcpClient.searchResidents(filters);

      expect(sendRequestSpy).toHaveBeenCalledWith('residents.search', filters);
      expect(response.result).toBeDefined();
      
      sendRequestSpy.mockRestore();
    });
  });

  describe('error handling', () => {
    it('should handle MCP server errors gracefully', async () => {
      // Mock the mcpServer.processRequest method instead of sendRequest
      // so that sendRequest's error handling logic can run
      const processRequestSpy = jest.spyOn(mcpClient['mcpServer'], 'processRequest');
      processRequestSpy.mockRejectedValue(new Error('Connection failed'));

      const response = await mcpClient.sendRequest('properties.search', {});

      expect(response.error).toBeDefined();
      expect(response.error?.code).toBe(-32603);
      expect(response.error?.message).toBe('Internal error');
      
      processRequestSpy.mockRestore();
    });
  });
});
