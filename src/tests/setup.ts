/**
 * Jest Test Setup
 * Global configuration and mocks for the test environment
 */

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.OPENAI_API_KEY = 'test-api-key';
process.env.MONGODB_URI = 'mongodb://localhost:27017/ai_assistant_test';
process.env.MONGODB_DB_NAME = 'ai_assistant_test';
process.env.SOCKET_IO_PORT = '3001';
process.env.LOG_LEVEL = 'error'; // Reduce log noise in tests

// Global test timeout
jest.setTimeout(30000);

// Mock console methods to reduce noise during tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Global error handler for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Mock Winston logger to avoid file system operations in tests
jest.mock('../shared/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
  }
}));

// Mock the config to use test values
jest.mock('../server/config', () => ({
  config: {
    port: 3000,
    socketPort: 3001,
    mcpServerPort: 3002,
    openai: {
      apiKey: 'test-api-key',
      model: 'gpt-3.5-turbo',
      maxTokens: 1500,
    },
    mongodb: {
      uri: 'mongodb://localhost:27017/ai_assistant_test',
      dbName: 'ai_assistant_test',
    },
    nodeEnv: 'test',
    logLevel: 'error',
  }
}));

// Global test utilities
export const createMockProperty = () => ({
  propertyId: 'PROP-TEST',
  address: {
    street: '123 Test Street',
    city: 'Test City',
    county: 'Test County',
    postcode: 'TEST123',
    country: 'UK'
  },
  type: 'flat' as const,
  details: {
    bedrooms: 2,
    bathrooms: 1,
    receptionRooms: 1,
    squareMetres: 75,
    furnished: false,
    petsAllowed: true,
    parking: 'none'
  },
  rent: {
    monthlyAmount: 1500,
    currency: 'GBP',
    deposit: 2250,
    billsIncluded: []
  },
  availability: {
    status: 'available' as const,
    availableFrom: new Date(),
    tenancyTerms: ['12 months AST']
  },
  amenities: ['test amenity'],
  createdAt: new Date(),
  updatedAt: new Date()
});

export const createMockResident = () => ({
  residentId: 'RES-TEST',
  personalInfo: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@test.com',
    mobile: '+44 7700 900123',
    dateOfBirth: new Date('1990-01-01')
  },
  currentTenancy: {
    propertyId: 'PROP-TEST',
    tenancyStart: new Date('2025-01-01'),
    tenancyEnd: new Date('2025-12-31'),
    monthlyRent: 1500,
    deposit: 2250,
    status: 'active' as const,
    tenancyType: 'AST'
  },
  emergencyContact: {
    name: 'Jane Doe',
    relationship: 'spouse',
    mobile: '+44 7700 900124'
  },
  documents: [],
  notes: ['Test resident'],
  createdAt: new Date(),
  updatedAt: new Date()
});
