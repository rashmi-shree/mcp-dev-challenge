import { Server } from 'socket.io';
import { createServer } from 'http';
import { config } from './config';
import { logger } from '../shared/logger';
import { AIAssistant } from '../mcp-client/ai-assistant';

/**
 * Socket.IO Server
 * Handles real-time communication between clients and the AI assistant
 */
class SocketIOServer {
  private server;
  private io;
  private aiAssistant: AIAssistant;

  constructor() {
    this.server = createServer();
    this.io = new Server(this.server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });
    this.aiAssistant = new AIAssistant();
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      logger.info(`Client connected: ${socket.id}`);

      // Handle incoming messages
      socket.on('message', async (data) => {
        try {
          logger.info(`Message received from ${socket.id}: ${data.message}`);
          
          // Process message through AI assistant
          const response = await this.aiAssistant.processMessage(data.message);
          
          // Send response back to client
          socket.emit('response', {
            message: response,
            timestamp: new Date().toISOString()
          });
        } catch (error) {
          logger.error(`Error processing message: ${error}`);
          socket.emit('error', {
            message: 'Sorry, I encountered an error processing your message.',
            timestamp: new Date().toISOString()
          });
        }
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        logger.info(`Client disconnected: ${socket.id}`);
      });
    });
  }

  public start() {
    this.server.listen(config.socketPort, () => {
      logger.info(`Socket.IO server running on port ${config.socketPort}`);
    });
  }
}

// Start the server
const socketServer = new SocketIOServer();
socketServer.start();
