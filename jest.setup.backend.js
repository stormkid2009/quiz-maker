// Setup for backend tests (API routes, server-side utilities, database operations)
// No DOM-related polyfills needed for Node.js environment

// Load environment variables from .env file
require('dotenv').config();

// Set test database URL if not already set
if (!process.env.DATABASE_URL) {
  // Use a test database URL - this should be configured in your environment
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost:27017/exams_test';
}

// Mock Next.js server-side modules that might not be available in test environment
jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn((data) => ({ json: () => data })),
    redirect: jest.fn(),
  },
}));

// Setup global test timeout
jest.setTimeout(15000);
