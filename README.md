# 🤖 Real-Time AI Assistant with MCP Integration

A comprehensive implementation of a real-time AI assistant system that integrates Socket.IO, OpenAI, and MongoDB through the Model Context Protocol (MCP) for property management.

## 🎯 Project Overview

This system demonstrates a complete real-time AI assistant architecture that:
- Processes natural language queries through OpenAI
- Manages property and tenant data via MongoDB
- Uses MCP (Model Context Protocol) for extensible AI functionality
- Provides real-time communication through Socket.IO
- Offers a terminal-based chat interface

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Terminal      │    │   AI Assistant  │    │    MongoDB      │
│   Client        │◄──►│   Server        │◄──►│   Database      │
│                 │    │                 │    │                 │
│ • Chat Interface│    │ • Socket.IO     │    │ • Properties    │
│ • User Input    │    │ • OpenAI API    │    │ • Residents     │
│ • Real-time     │    │ • MCP Client    │    │ • Sample Data   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Community Edition
- OpenAI API key

### Installation & Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env and add your OpenAI API key
   ```

3. **Start MongoDB**
   ```bash
   brew services start mongodb-community
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

### Running the Application

**Option 1: Separate terminals (recommended for development)**
```bash
# Terminal 1 - Start the server
npm run dev:server

# Terminal 2 - Start the client
npm run dev:client
```

**Option 2: Combined (single terminal)**
```bash
npm run dev
```

### Verification

To verify everything is working:

1. **Check Node.js version:** `node --version` (should be 18+)
2. **Check MongoDB status:** `brew services list | grep mongodb`
3. **Test build:** `npm run build`
4. **Check ports:** Make sure port 3001 is available

## 💬 Usage Examples

Once both server and client are running, try these natural language queries:

### Property Search
```
"Show me all available 2-bedroom flats under £2000"
"Find properties in Manchester"
"List flats that allow pets"
```

### Tenant Management
```
"Who is the current tenant of PROP-001?"
"Find tenant named James Wilson"
"Show all active residents"
```

### Property Creation
```
"Add a new property at 999 Oak Street, 3 bedrooms, £2500/month"
"Create property at 456 Pine Avenue, 1 bedroom flat, £1200 rent"
```

## 🗄️ Database

The system automatically creates sample data:
- **3 Properties**: PROP-001 (Manchester), PROP-002 (London), PROP-003 (Edinburgh)
- **1 Resident**: James Wilson (tenant of PROP-001)

### MongoDB Access
- **Connection**: `mongodb://localhost:27017`
- **Database**: `property_management`
- **Collections**: `properties`, `residents`

Use MongoDB Compass for visual database exploration.

## 🛠️ Development

### Project Structure
```
src/
├── server/           # Socket.IO server implementation
├── client/           # Terminal client interface
├── mcp-client/       # AI assistant and MCP client
├── mcp-server/       # MongoDB MCP server
├── shared/           # Shared types and utilities
└── tests/           # Test files
```

### Example Conversation Flow

```
User: "Show me all available 2-bedroom flats under £2000"

AI Assistant: I'll search for available 2-bedroom flats under £2000 for you.
[MCP Server queries MongoDB with filters: type="flat", bedrooms=2, monthlyAmount<2000, status="available"]

Found 3 properties matching your criteria:

1. **PROP-001** - 123 High Street, Manchester
   - 2 bed, 1 bath, 1 reception, 75m²
   - £1,800/month + deposit
   - Available from 1st August
   - Pets allowed, allocated parking

2. **PROP-045** - 456 King's Road, London
   - 2 bed, 1 bath, 1 reception, 68m²
   - £1,950/month + deposit
   - Available immediately
   - Communal garden, gym, concierge

3. **PROP-067** - 789 Castle Street, Edinburgh
   - 2 bed, 1 bath, 1 reception, 82m²
   - £1,650/month + deposit
   - Available from 15th July
   - Washing machine included, pets allowed

Would you like more details about any of these properties?

---

User: "Who is the current tenant of PROP-001?"

AI Assistant: Let me look up the current tenant information for PROP-001.
[MCP Server queries residents collection with propertyId="PROP-001" and status="active"]

The current tenant of PROP-001 (123 High Street, Manchester) is:
- **James Wilson**
- Email: james.wilson@email.co.uk
- Mobile: +44 7700 900123
- Tenancy: Active AST from 1st Jan 2025 to 31st Dec 2025
- Monthly rent: £1,800

Note: There appears to be conflicting information. The property shows as "available" but has an active tenant. You may want to verify the property status.

---

User: "Add a new property at 999 Victoria Street, 3 bedrooms, £2800/month"

AI Assistant: I'll add the new property to the system.
[MCP Server creates new property document in MongoDB]

✅ Successfully added new property:
- **Property ID**: PROP-101
- **Address**: 999 Victoria Street
- **Type**: 3 bedrooms
- **Rent**: £2,800/month
- **Status**: Available
- **Created**: 10th July 2025

The property has been added to the database. Would you like to add more details like amenities, square meterage, or availability date?
```

## Getting Started

### Provided Structure
This repository includes a basic project structure generated by Claude Sonnet 4 to help you get started quickly. **Please note**: This is a foundational template and may not be a perfect starting point for your specific approach. You'll find:

- **Complete setup**: `package.json`, TypeScript config, environment templates
- **Basic implementations**: Socket.IO server, terminal client, AI assistant, and MCP server foundations
- **Development tools**: Testing framework, logging, and build scripts
- **Documentation**: `GETTING_STARTED.md` and `IMPLEMENTATION.md` for detailed guidance

The provided code is intentionally basic and may have areas that need improvement, refinement, or complete redesign based on your preferred architecture and best practices.

### Your Freedom to Choose
While we've provided this structure as a helpful starting point, **you're completely free to modify, replace, or rebuild any part of it**. The goal is to meet the challenge requirements, not to use our specific implementation approach.

Feel free to:
- ✅ Use the provided structure as-is and build upon it
- ✅ Modify any components to fit your preferred architecture
- ✅ Replace technologies with alternatives (e.g., Express instead of raw Socket.IO server)
- ✅ Reorganize the folder structure entirely
- ✅ Start from scratch if you prefer your own approach

**What matters most**: Your final solution should demonstrate the core requirements and showcase your backend development skills.

## 🧪 Testing

The system includes comprehensive test coverage for all major components:

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- src/tests/types.test.ts
```

### Test Coverage
- **Unit Tests**: Individual component testing
- **Integration Tests**: Component interaction testing  
- **Type Safety Tests**: TypeScript interface validation
- **Configuration Tests**: Environment setup validation

### Test Files
```
src/tests/
├── setup.ts              # Test configuration and mocks
├── types.test.ts          # Type definitions testing
├── config.test.ts         # Configuration testing
├── ai-assistant.test.ts   # AI Assistant functionality
├── mcp-client.test.ts     # MCP Client testing
└── mcp-server.test.ts     # MongoDB MCP Server testing
```

### Mock Strategy
Tests use comprehensive mocking to avoid external dependencies:
- External API calls (OpenAI)
- Database connections (MongoDB)  
- File system operations
- Network requests