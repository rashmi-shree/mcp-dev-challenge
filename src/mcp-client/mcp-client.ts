import { MCPRequest, MCPResponse } from '../shared/types';
import { MongoMCPServer } from '../mcp-server/mongo-mcp-server';
import { logger } from '../shared/logger';

/**
 * MCP Client
 * Handles communication with MCP servers
 */
export class MCPClient {
  private mcpServer: MongoMCPServer;

  constructor() {
    this.mcpServer = new MongoMCPServer();
  }

  /**
   * Initialize the MCP client
   */
  async initialize(): Promise<void> {
    try {
      await this.mcpServer.connect();
      logger.info('MCP Client initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize MCP Client:', error);
      throw error;
    }
  }

  /**
   * Send a request to the MCP server
   */
  async sendRequest(method: string, params?: any): Promise<MCPResponse> {
    try {
      const request: MCPRequest = {
        method,
        params,
        id: Date.now().toString()
      };

      logger.info(`Sending MCP request: ${method}`, params);
      const response = await this.mcpServer.processRequest(request);
      logger.info(`MCP response received for: ${method}`);
      
      return response;
    } catch (error) {
      logger.error(`MCP request failed for ${method}:`, error);
      return {
        error: {
          code: -32603,
          message: 'Internal error',
          data: error
        }
      };
    }
  }

  /**
   * Property management methods
   */
  async searchProperties(filters: any): Promise<MCPResponse> {
    return this.sendRequest('properties.search', filters);
  }

  async createProperty(propertyData: any): Promise<MCPResponse> {
    return this.sendRequest('properties.create', propertyData);
  }

  async updateProperty(propertyId: string, updateData: any): Promise<MCPResponse> {
    return this.sendRequest('properties.update', { propertyId, ...updateData });
  }

  async deleteProperty(propertyId: string): Promise<MCPResponse> {
    return this.sendRequest('properties.delete', { propertyId });
  }

  /**
   * Resident management methods
   */
  async searchResidents(filters: any): Promise<MCPResponse> {
    return this.sendRequest('residents.search', filters);
  }

  async createResident(residentData: any): Promise<MCPResponse> {
    return this.sendRequest('residents.create', residentData);
  }

  async updateResident(residentId: string, updateData: any): Promise<MCPResponse> {
    return this.sendRequest('residents.update', { residentId, ...updateData });
  }

  async deleteResident(residentId: string): Promise<MCPResponse> {
    return this.sendRequest('residents.delete', { residentId });
  }

  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    await this.mcpServer.disconnect();
    logger.info('MCP Client cleaned up');
  }
}
