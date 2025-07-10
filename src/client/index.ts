import { io, Socket } from 'socket.io-client';
import * as readline from 'readline';
import { config } from '../server/config';
import { logger } from '../shared/logger';
import { ChatMessage, ChatResponse } from '../shared/types';

/**
 * Terminal Chat Client
 * Provides a command-line interface for chatting with the AI assistant
 */
class ChatClient {
  private socket: Socket;
  private rl: readline.Interface;

  constructor() {
    // Initialize Socket.IO client
    this.socket = io(`http://localhost:${config.socketPort}`, {
      autoConnect: false
    });

    // Initialize readline interface
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    // Socket event handlers
    this.socket.on('connect', () => {
      logger.info('Connected to server');
      console.log('🤖 AI Assistant connected! Type your message and press Enter.');
      console.log('Type "exit" to quit.\n');
      this.promptUser();
    });

    this.socket.on('disconnect', () => {
      logger.info('Disconnected from server');
      console.log('❌ Disconnected from server');
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
      console.log('❌ Failed to connect to server. Make sure the server is running.');
      process.exit(1);
    });
  }

  private promptUser() {
    this.rl.question('You: ', (input) => {
      if (input.toLowerCase() === 'exit') {
        this.disconnect();
        return;
      }

      if (input.trim()) {
        const message: ChatMessage = {
          message: input,
          timestamp: new Date().toISOString()
        };
        this.socket.emit('message', message);
      } else {
        this.promptUser();
      }
    });
  }

  public connect() {
    console.log('🔄 Connecting to AI Assistant...');
    this.socket.connect();
  }

  public disconnect() {
    console.log('\n👋 Goodbye!');
    this.socket.disconnect();
    this.rl.close();
    process.exit(0);
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n\n👋 Goodbye!');
  process.exit(0);
});

// Start the client
const client = new ChatClient();
client.connect();
