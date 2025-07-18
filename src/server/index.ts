import { Server } from 'socket.io';
import { createServer } from 'http';
import { config } from './config';
import { logger } from '../shared/logger';
import { AIAssistant } from '../mcp-client/ai-assistant';

/**
 * Socket.IO Server
 * Handles real-time communication between clients and the AI assistant
 * Implements the MCP (Model Context Protocol) for property management
 */
class SocketIOServer {
  private server;
  private io;
  private aiAssistant: AIAssistant;

  constructor() {
    // Create HTTP server
    this.server = createServer();
    
    // Initialize Socket.IO with CORS configuration
    this.io = new Server(this.server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });
    
    // Initialize AI Assistant
    this.aiAssistant = new AIAssistant();
    this.setupEventHandlers();
  }

  /**
   * Setup Socket.IO event handlers
   */
  private setupEventHandlers(): void {
    this.io.on('connection', (socket) => {
      logger.info(`Client connected: ${socket.id}`);

      // Handle incoming messages from clients
      socket.on('message', async (data) => {
        try {
          logger.info(`Message received from ${socket.id}: ${data.message}`);
          
          // Process message through AI assistant with MCP integration
          const response = await this.aiAssistant.processMessage(data.message);
          
          // Send response back to client
          socket.emit('response', {
            message: response,
            timestamp: new Date().toISOString(),
            type: 'ai'
          });
          
        } catch (error) {
          logger.error(`Error processing message from ${socket.id}:`, error);
          
          // Send error response to client
          socket.emit('error', {
            message: 'Sorry, I encountered an error processing your message. Please try again.',
            timestamp: new Date().toISOString(),
            type: 'error'
          });
        }
      });

      // Handle client disconnection
      socket.on('disconnect', (reason) => {
        logger.info(`Client disconnected: ${socket.id} (reason: ${reason})`);
      });
      
      // Handle connection errors
      socket.on('error', (error) => {
        logger.error(`Socket error for ${socket.id}:`, error);
      });
    });
    
    // Handle server-level errors
    this.io.on('error', (error) => {
      logger.error('Socket.IO server error:', error);
    });
  }

  /**
   * Start the server
   */
  public start(): void {
    this.server.listen(config.socketPort, () => {
      logger.info(`Socket.IO server running on port ${config.socketPort}`);
      logger.info('Ready to accept client connections');
    });
    
    // Handle server errors
    this.server.on('error', (error) => {
      logger.error('HTTP server error:', error);
    });
  }

  /**
   * Stop the server gracefully
   */
  public async stop(): Promise<void> {
    try {
      // Cleanup AI Assistant resources
      await this.aiAssistant.cleanup();
      
      // Close Socket.IO server
      this.io.close();
      
      // Close HTTP server
      this.server.close();
      
      logger.info('Socket.IO server stopped gracefully');
    } catch (error) {
      logger.error('Error during server shutdown:', error);
    }
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('Received SIGTERM signal, shutting down gracefully');
  await socketServer.stop();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('Received SIGINT signal, shutting down gracefully');
  await socketServer.stop();
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
const socketServer = new SocketIOServer();
socketServer.start();
