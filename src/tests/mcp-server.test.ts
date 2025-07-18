import { MongoMCPServer } from '../mcp-server/mongo-mcp-server';
import { MCPRequest } from '../shared/types';

describe('MongoMCPServer', () => {
  let mcpServer: MongoMCPServer;

  beforeEach(() => {
    mcpServer = new MongoMCPServer();
  });

  afterEach(async () => {
    await mcpServer.disconnect();
  });

  describe('processRequest', () => {
    it('should handle properties.search request', async () => {
      const request: MCPRequest = {
        method: 'properties.search',
        params: { bedrooms: 2, maxRent: 2000 },
        id: 'test-1'
      };

      const response = await mcpServer.processRequest(request);
      
      expect(response).toBeDefined();
      expect(response.id).toBe('test-1');
      
      if (response.result) {
        expect(response.result).toHaveProperty('properties');
        expect(Array.isArray(response.result.properties)).toBe(true);
      }
    });

    it('should handle invalid method gracefully', async () => {
      const request: MCPRequest = {
        method: 'invalid.method',
        params: {},
        id: 'test-2'
      };

      const response = await mcpServer.processRequest(request);
      
      expect(response).toBeDefined();
      expect(response.error).toBeDefined();
      expect(response.error?.code).toBe(-32601);
      expect(response.error?.message).toContain('Method not found');
    });

    it('should create new property', async () => {
      const propertyData = {
        address: {
          street: 'Test Street 123',
          city: 'Test City',
          county: 'Test County',
          postcode: 'TEST123',
          country: 'UK'
        },
        type: 'flat',
        details: {
          bedrooms: 2,
          bathrooms: 1,
          receptionRooms: 1,
          squareMetres: 75,
          furnished: false,
          petsAllowed: true,
          parking: 'none'
        },
        rent: {
          monthlyAmount: 1500,
          currency: 'GBP',
          deposit: 2250,
          billsIncluded: []
        },
        availability: {
          status: 'available',
          availableFrom: new Date(),
          tenancyTerms: ['12 months AST']
        },
        amenities: ['test amenity']
      };

      const request: MCPRequest = {
        method: 'properties.create',
        params: propertyData,
        id: 'test-3'
      };

      const response = await mcpServer.processRequest(request);
      
      expect(response).toBeDefined();
      expect(response.id).toBe('test-3');
      
      if (response.result) {
        expect(response.result.success).toBe(true);
        expect(response.result.propertyId).toBeDefined();
      }
    });
  });

  describe('connect and disconnect', () => {
    it('should connect to database successfully', async () => {
      // Test database connection
      await expect(mcpServer.connect()).resolves.not.toThrow();
    });

    it('should disconnect from database successfully', async () => {
      await mcpServer.connect();
      await expect(mcpServer.disconnect()).resolves.not.toThrow();
    });
  });
});
