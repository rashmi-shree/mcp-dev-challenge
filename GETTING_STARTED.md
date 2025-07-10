# Getting Started with MCP Dev Challenge

This document will help you get started with the Real-Time AI Assistant challenge.

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- OpenAI API key
- Basic knowledge of TypeScript/JavaScript, Socket.IO, and MongoDB

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Copy the example environment file and configure your settings:

```bash
# On Windows
copy .env.example .env

# On macOS/Linux
cp .env.example .env
```

Edit `.env` and add your configuration:
- `OPENAI_API_KEY`: Your OpenAI API key
- `MONGODB_URI`: Your MongoDB connection string
- Other ports can be left as defaults

### 3. Build the Project

```bash
npm run build
```

### 4. Start Development

For development with hot reload:

```bash
# Start all services in development mode
npm run dev

# Or start services individually:
npm run dev:server    # Socket.IO server
npm run dev:client    # Terminal client
npm run dev:mcp-server # MCP server
```

### 5. Production Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── client/           # Terminal chat client
│   └── index.ts
├── server/           # Socket.IO server
│   ├── index.ts
│   └── config.ts
├── mcp-client/       # AI Assistant (MCP client)
│   └── ai-assistant.ts
├── mcp-server/       # MongoDB MCP server
│   └── index.ts
├── shared/           # Shared types and utilities
│   ├── types.ts
│   └── logger.ts
└── tests/            # Test files
    ├── setup.ts
    └── *.test.ts
```

## Development Workflow

1. **Start MongoDB**: Make sure MongoDB is running locally or configure MongoDB Atlas
2. **Start the MCP Server**: `npm run dev:mcp-server`
3. **Start the Socket.IO Server**: `npm run dev:server`
4. **Start the Client**: `npm run dev:client`

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Key Implementation Tasks

### 1. Complete the AI Assistant
- Integrate MCP protocol communication
- Implement property search functionality
- Add conversation context management

### 2. Enhance the MCP Server
- Add all CRUD operations for properties and residents
- Implement proper error handling
- Add data validation

### 3. Improve the Client
- Add better error handling and reconnection logic
- Implement command parsing (e.g., `/search`, `/help`)
- Add message history

### 4. Add Advanced Features
- User authentication
- Property image handling
- Real-time notifications
- Analytics and reporting

## MongoDB Setup

### Local MongoDB
```bash
# Install MongoDB Community Edition
# Start MongoDB service
mongod --dbpath /path/to/your/data/directory
```

### Sample Data
You can add sample properties and residents using the MongoDB shell or a GUI tool like MongoDB Compass.

## Troubleshooting

### Common Issues

1. **Connection Errors**: Make sure all services are running on the correct ports
2. **OpenAI API Errors**: Verify your API key is valid and has sufficient credits
3. **MongoDB Connection**: Check your connection string and ensure MongoDB is running

### Logs
Check the logs in the `logs/` directory for detailed error information.

## Next Steps

1. Review the challenge requirements in README.md
2. Study the existing code structure
3. Start implementing the missing functionality
4. Test your implementation thoroughly
5. Add comprehensive error handling and logging

Good luck with the challenge!
