import { io, Socket } from 'socket.io-client';
import * as readline from 'readline';
import { config } from '../server/config';
import { logger } from '../shared/logger';
import { ChatMessage, ChatResponse } from '../shared/types';

/**
 * Terminal Chat Client
 * Provides a command-line interface for chatting with the AI assistant
 * Connects to the Socket.IO server for real-time communication
 */
class ChatClient {
  private socket: Socket;
  private rl: readline.Interface;
  private isConnected = false;

  constructor() {
    // Initialize Socket.IO client
    this.socket = io(`http://localhost:${config.socketPort}`, {
      autoConnect: false,
      timeout: 5000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    // Initialize readline interface for terminal input
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: 'You: '
    });

    this.setupEventHandlers();
  }

  /**
   * Setup Socket.IO and readline event handlers
   */
  private setupEventHandlers(): void {
    // Socket event handlers
    this.socket.on('connect', () => {
      this.isConnected = true;
      logger.info('Connected to AI Assistant server');
      this.promptUser();
    });

    this.socket.on('disconnect', (reason) => {
      this.isConnected = false;
      logger.info(`Disconnected from server: ${reason}`);
      console.log('\n❌ Disconnected from server');
      
      if (reason === 'io server disconnect') {
        // Server initiated disconnect, don't reconnect
        console.log('Server closed the connection. Exiting...');
        this.cleanup();
      }
    });

    this.socket.on('response', (data: ChatResponse) => {
      console.log(`\n🤖 AI: ${data.message}\n`);
      this.promptUser();
    });

    this.socket.on('error', (data: ChatResponse) => {
      console.log(`\n❌ Error: ${data.message}\n`);
      this.promptUser();
    });

    this.socket.on('connect_error', (error) => {
      logger.error('Connection error:', error);
      console.log('\n❌ Failed to connect to server. Make sure the server is running on port', config.socketPort);
      console.log('Try starting the server with: npm run dev:server\n');
      this.cleanup();
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log(`\n✅ Reconnected to server (attempt ${attemptNumber})`);
      this.promptUser();
    });

    this.socket.on('reconnect_error', (error) => {
      console.log('\n⚠️ Reconnection failed, retrying...');
    });

    this.socket.on('reconnect_failed', () => {
      console.log('\n❌ Failed to reconnect to server after multiple attempts');
      this.cleanup();
    });

    // Readline event handlers
    this.rl.on('line', (input) => {
      this.handleUserInput(input.trim());
    });

    this.rl.on('SIGINT', () => {
      this.handleExit();
    });
  }

  /**
   * Handle user input from terminal
   */
  private handleUserInput(input: string): void {
    if (!input) {
      this.promptUser();
      return;
    }

    // Check for exit commands
    if (['exit', 'quit', 'q'].includes(input.toLowerCase())) {
      this.handleExit();
      return;
    }

    // Check if connected before sending message
    if (!this.isConnected) {
      console.log('❌ Not connected to server. Please wait for connection...\n');
      this.promptUser();
      return;
    }

    // Send message to server
    const message: ChatMessage = {
      message: input,
      timestamp: new Date().toISOString()
    };

    this.socket.emit('message', message);
  }

  /**
   * Prompt user for input
   */
  private promptUser(): void {
    if (this.isConnected) {
      this.rl.prompt();
    }
  }

  /**
   * Handle exit command
   */
  private handleExit(): void {
    console.log('\n👋 Goodbye!');
    this.cleanup();
  }

  /**
   * Connect to the server
   */
  public connect(): void {
    console.log('🔄 Connecting to AI Assistant server...');
    this.socket.connect();
  }

  /**
   * Clean up resources and exit
   */
  private cleanup(): void {
    this.socket.disconnect();
    this.rl.close();
    process.exit(0);
  }
}

// Handle process termination signals
process.on('SIGTERM', () => {
  console.log('\n\n👋 Received termination signal. Goodbye!');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n\n👋 Goodbye!');
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  console.error('\n❌ Uncaught exception:', error.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('\n❌ Unhandled rejection:', reason);
  process.exit(1);
});

// Start the client
const client = new ChatClient();
client.connect();
