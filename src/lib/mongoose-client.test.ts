// mongoose-client.test.ts
import mongoose from 'mongoose';
import connectToDB from './mongoose-client';

jest.mock('mongoose', () => ({
  connect: jest.fn(),
}));

const mockConnect = mongoose.connect as jest.Mock;

describe('connectToDB', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    jest.resetModules();
    mockConnect.mockReset();
    global.mongoose = { conn: null, promise: null };
    // Restore original env before each test
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    // Fully restore env after each test
    process.env = originalEnv;
  });

  it('throws an error if MONGODB_URI is undefined', () => {
    // Type assertion to bypass TypeScript's readonly checks
    const mutableEnv = process.env as { [key: string]: string | undefined };
    delete mutableEnv.MONGODB_URI;

    jest.isolateModules(() => {
      expect(() => require('./mongoose-client')).toThrow(
        'Please define the MONGODB_URI environment variable inside .env.local'
      );
    });
  });

  // Other tests remain the same...
});
