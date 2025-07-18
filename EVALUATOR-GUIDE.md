# 🎯 For Assignment Evaluator - Quick Start Guide

## 📦 What You're Getting

A complete **Real-Time AI Assistant with MCP Integration** that includes:
- Socket.IO server for real-time communication
- Terminal client for chat interface
- AI Assistant with OpenAI integration
- MongoDB MCP server for property management
- Local development setup

## 🚀 Quick Start (3 steps)

### 1. Prerequisites
- Node.js 18+
- MongoDB (running locally)
- OpenAI API key

### 2. Setup
```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env and add your OpenAI API key

# Make sure MongoDB is running
brew services start mongodb-community

# Build the project
npm run build
```

### 3. Run the System
```bash
# Terminal 1 - Start the server
npm run dev:server

# Terminal 2 - Start the client
npm run dev:client
```

### 4. Test the Implementation (Optional)
```bash
# Run all tests
npm test

# Run specific test categories
npm test -- --testPathPattern="types|config"
```

## 🎮 Demo Queries

The system comes pre-loaded with sample data. Try these:

```
Property Search:
- "Show me all available 2-bedroom flats under £2000"
- "Find properties in Manchester"
- "List flats with parking"

Tenant Management:
- "Who is the current tenant of PROP-001?"
- "Find tenant named James"
- "Show active residents"

Property Creation:
- "Add a new property at 999 Oak Street, 3 bedrooms, £2500/month"
- "Create property at 456 Pine Ave, 1 bedroom, £1200 rent"

General:
- "Hello, what can you help me with?"
- "How many properties are available?"
```

## 📊 View Database

**MongoDB Compass:**
- Connection: `mongodb://localhost:27017`
- Database: `property_management`
- Collections: `properties`, `residents`

**Command Line:**
```bash
mongosh
use property_management
db.properties.find().pretty()
```

## 🛠️ Architecture Overview

```
Terminal Client ←→ Socket.IO Server ←→ AI Assistant ←→ MCP Server ←→ MongoDB
    (stdin/out)      (port 3001)        (OpenAI)        (Property DB)   (port 27017)
```

## 🔧 Key Features Demonstrated

✅ **Real-time Communication** - Socket.IO for instant messaging  
✅ **Natural Language Processing** - Intent recognition from user queries  
✅ **AI Integration** - OpenAI API with context awareness  
✅ **MCP Protocol** - Model Context Protocol for database operations  
✅ **Property Management** - CRUD operations on properties and residents  
✅ **Error Handling** - Comprehensive error management  
✅ **Sample Data** - Pre-loaded with realistic UK property data  
✅ **Testing Suite** - Comprehensive test coverage with Jest
✅ **Error Handling** - Production-ready error management
✅ **Documentation** - Complete setup and usage guides  

## 🐛 Troubleshooting

**If MongoDB connection fails:**
```bash
# Start MongoDB
brew services start mongodb-community

# Check if running
brew services list | grep mongodb
```

**If build fails:**
```bash
npm run clean
npm install
npm run build
```

**If client won't connect:**
- Make sure server is running: `npm run dev:server`
- Check port 3001 is available

## 📁 Project Structure

```
src/
├── server/           # Socket.IO server
├── client/           # Terminal client
├── mcp-client/       # AI assistant + MCP client
├── mcp-server/       # MongoDB MCP server
├── shared/           # Types and utilities
└── tests/           # Test files
```

## 🎯 Technical Implementation

**Technologies Used:**
- Node.js + TypeScript
- Socket.IO for real-time communication
- OpenAI API for AI responses
- MongoDB for data storage
- Model Context Protocol (MCP) for extensibility

**Key Files:**
- `src/server/index.ts` - Socket.IO server
- `src/client/index.ts` - Terminal client
- `src/mcp-client/ai-assistant.ts` - AI with intent recognition
- `src/mcp-server/mongo-mcp-server.ts` - MongoDB operations
- `src/shared/types.ts` - TypeScript definitions

## 🔄 Development Commands

```bash
# Start both server and client
npm run dev

# Start server only
npm run dev:server

# Start client only
npm run dev:client

# Build project
npm run build

# Run tests
npm test
```

## 🏁 Success Criteria

You should be able to:
1. ✅ Start MongoDB locally
2. ✅ Build the project successfully
3. ✅ Run server and client in separate terminals
4. ✅ Query properties using natural language
5. ✅ View tenant information
6. ✅ Add new properties
7. ✅ See real-time AI responses
8. ✅ Access MongoDB data via Compass

## 📞 Support

If you encounter any issues:
1. Check MongoDB is running: `brew services list | grep mongodb`
2. Ensure Node.js 18+ is installed: `node --version`
3. Verify OpenAI API key is set in `.env`
4. Try rebuilding: `npm run build`

The system demonstrates a complete real-time AI assistant with MCP integration for property management!
