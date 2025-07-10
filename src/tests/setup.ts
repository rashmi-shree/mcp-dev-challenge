// Jest setup file
// This file runs before each test suite

// Mock environment variables for testing
process.env.NODE_ENV = 'test';
process.env.OPENAI_API_KEY = 'test-api-key';
process.env.MONGODB_URI = 'mongodb://localhost:27017/property_management_test';

// Increase timeout for async operations
jest.setTimeout(30000);

// Global test setup
beforeAll(() => {
  // Any global setup before all tests
});

afterAll(() => {
  // Any global cleanup after all tests
});

beforeEach(() => {
  // Reset any mocks or state before each test
  jest.clearAllMocks();
});

afterEach(() => {
  // Cleanup after each test
});
