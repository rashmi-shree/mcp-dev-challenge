import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Application Configuration
 * Centralized configuration management for the AI Assistant MCP system
 */
export const config = {
  // Server configuration
  port: parseInt(process.env.SERVER_PORT || '3000'),
  socketPort: parseInt(process.env.SOCKET_IO_PORT || '3001'),
  mcpServerPort: parseInt(process.env.MCP_SERVER_PORT || '3002'),
  
  // OpenAI configuration
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: 'gpt-3.5-turbo',
    maxTokens: 1500,
  },
  
  // MongoDB configuration
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/property_management',
    dbName: process.env.MONGODB_DB_NAME || 'property_management',
  },
  
  // Application configuration
  nodeEnv: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'info',
};
