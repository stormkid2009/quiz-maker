import { GET } from '../route';

// Mock NextResponse since we're testing in a Node.js environment
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data) => ({
      json: async () => data,
      status: 200,
    })),
  },
}));

describe('Health Check API Route', () => {
  it('should return a healthy status', async () => {
    const response = await GET();
    const data = await response.json();
    
    expect(data.status).toBe('healthy');
    expect(data.service).toBe('quiz-maker');
    expect(data.timestamp).toBeDefined();
    expect(typeof data.timestamp).toBe('string');
  });
  
  it('should return a valid timestamp', async () => {
    const response = await GET();
    const data = await response.json();
    
    const timestamp = new Date(data.timestamp);
    expect(timestamp).toBeInstanceOf(Date);
    expect(isNaN(timestamp.getTime())).toBe(false);
  });
});
