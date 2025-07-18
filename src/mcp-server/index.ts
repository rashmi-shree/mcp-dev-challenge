import { MongoMCPServer } from './mongo-mcp-server';
import { config } from '../server/config';
import { logger } from '../shared/logger';

/**
 * MCP Server Entry Point
 * Starts the MongoDB MCP server
 */
class MCPServerApp {
  private mcpServer: MongoMCPServer;

  constructor() {
    this.mcpServer = new MongoMCPServer();
  }

  async start(): Promise<void> {
    try {
      await this.mcpServer.connect();
      
      // Initialize sample data in development
      if (config.nodeEnv === 'development') {
        await this.mcpServer.initializeSampleData();
      }

      logger.info('MCP Server started successfully');
      logger.info('Ready to process MCP requests');
      
    } catch (error) {
      logger.error('Failed to start MCP Server:', error);
      process.exit(1);
    }
  }

  async stop(): Promise<void> {
    await this.mcpServer.disconnect();
    logger.info('MCP Server stopped');
  }

  getMCPServer(): MongoMCPServer {
    return this.mcpServer;
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('Received SIGTERM, shutting down gracefully');
  await mcpServerApp.stop();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('Received SIGINT, shutting down gracefully');
  await mcpServerApp.stop();
  process.exit(0);
});

// Start the MCP server
const mcpServerApp = new MCPServerApp();
mcpServerApp.start();

export { mcpServerApp };
