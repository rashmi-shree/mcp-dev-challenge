# Backend Node.js Developer Challenge: Real-Time AI Assistant with MCP Integration

## Overview
Build a real-time AI assistant system that uses MCP. This challenge combines Socket.IO for real-time communication, the Model Context Protocol (MCP) for extensible AI functionality, and OpenAI's powerful language models.

You'll create a simple chat system where users can interact with an AI assistant through a terminal interface. The AI assistant will be enhanced with MCP server capabilities, allowing it to perform practical tasks like database operations, file management, or API integrations. The recommended implementation focuses on property management with MongoDB, but you're encouraged to explore other MCP server options that interest you.

This challenge tests your ability to integrate multiple technologies, design clean architectures, and build production-ready Node.js applications with proper error handling, logging, and testing.

## Challenge Components

### 1. Terminal Chat Client (Socket.IO Client)
Create a Socket.IO client that:
- Reads user input from `stdin`
- Sends messages to the Socket.IO server
- Displays server responses to `stdout`
- Handles connection states and reconnection logic
- Provides a clean terminal-based chat interface

### 2. Socket.IO Server
Implement a Socket.IO server that:
- Handles real-time connection from the client
- Processes incoming messages
- Manages message history for the session
- Implements proper error handling and logging

### 3. AI Assistant (MCP Client)
Build an MCP client that:
- Integrates with OpenAI API
- Processes user messages and generates contextual responses
- Implements conversation memory and context management
- Uses basic MCP protocol structure for AI communication

### 4. MCP Server Integration
Choose and integrate an MCP server that extends the AI assistant's capabilities. Options include:

#### Option A: MongoDB MCP Server (Recommended)
Create or integrate a MongoDB MCP server for property management:
- Performs CRUD operations on MongoDB collections
- Manages property and resident data
- Can be imported from existing MCP server packages or built from scratch

#### Option B: Alternative MCP Servers
Feel free to explore other MCP servers such as:
- File system operations
- Web scraping capabilities
- Database connectors (PostgreSQL, SQLite, etc.)
- API integration servers
- Custom business logic servers

The choice of MCP server should demonstrate practical integration and add meaningful functionality to the AI assistant.

## Technical Requirements

### Core Technologies
- **Node.js** (v18+)
- **Socket.IO** (client & server)
- **MongoDB**
- **Model Context Protocol (MCP)**
- **TypeScript** (preferred) or JavaScript

### Architecture Requirements
- Modular, clean code structure
- Proper error handling and logging
- Environment-based configuration
- Unit tests for critical components

## Example Implementation: Property Management System

### MongoDB Schema Examples

#### Properties Collection
```javascript
{
  _id: ObjectId,
  propertyId: "PROP-001",
  address: {
    street: "123 High Street",
    city: "Manchester",
    county: "Greater Manchester",
    postcode: "M1 2AB",
    country: "UK"
  },
  type: "flat", // flat, house, maisonette, studio, etc.
  details: {
    bedrooms: 2,
    bathrooms: 1,
    receptionRooms: 1,
    squareMetres: 75,
    furnished: false,
    petsAllowed: true,
    parking: "allocated space"
  },
  rent: {
    monthlyAmount: 1800,
    currency: "GBP",
    deposit: 2700, // 1.5 months rent
    billsIncluded: ["water", "council tax"]
  },
  availability: {
    status: "available", // available, let, maintenance
    availableFrom: ISODate("2025-08-01"),
    tenancyTerms: ["12 months AST", "6 months short let"]
  },
  amenities: ["communal garden", "gym", "concierge", "balcony"],
  createdAt: ISODate,
  updatedAt: ISODate
}
```

#### Residents Collection
```javascript
{
  _id: ObjectId,
  residentId: "RES-001",
  personalInfo: {
    firstName: "James",
    lastName: "Wilson",
    email: "james.wilson@email.co.uk",
    mobile: "+44 7700 900123",
    dateOfBirth: ISODate("1990-05-15")
  },
  currentTenancy: {
    propertyId: "PROP-001",
    tenancyStart: ISODate("2025-01-01"),
    tenancyEnd: ISODate("2025-12-31"),
    monthlyRent: 1800,
    deposit: 2700,
    status: "active", // active, expired, terminated
    tenancyType: "AST" // Assured Shorthold Tenancy
  },
  emergencyContact: {
    name: "Sarah Wilson",
    relationship: "partner",
    mobile: "+44 7700 900124"
  },
  documents: [
    {
      type: "tenancy_agreement",
      url: "/documents/tenancy_001.pdf",
      uploadedAt: ISODate
    },
    {
      type: "right_to_rent",
      url: "/documents/rtr_001.pdf",
      uploadedAt: ISODate
    }
  ],
  notes: ["Excellent tenant", "Always pays rent on time", "Very tidy"],
  createdAt: ISODate,
  updatedAt: ISODate
}
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