# Testing Configuration

This project uses Jest with separate configurations for frontend and backend testing to accommodate the different environments required by a Next.js application.

## Test Structure

### Frontend Tests (Browser Environment)
- **Environment**: `jest-environment-jsdom`
- **Purpose**: Test React components, hooks, client-side utilities, and shared schemas
- **Location**: `src/components/`, `src/hooks/`, `src/shared/`, `src/utils/`
- **Configuration**: `jest.config.js`

### Backend Tests (Node.js Environment)
- **Environment**: `node`
- **Purpose**: Test API routes, server-side utilities, and database operations
- **Location**: `src/app/api/`, `src/lib/`
- **Configuration**: `jest.config.db.js`

## Available Commands

```bash
# Run frontend tests only
yarn test:frontend

# Run backend tests only
yarn test:backend

# Run all tests (both frontend and backend)
yarn test:all

# Run tests in watch mode
yarn test:watch

# Run tests with coverage report
yarn test:coverage

# Default test command (frontend only for compatibility)
yarn test
```

## Configuration Files

### `jest.config.js` - Frontend Tests
- Uses jsdom environment for DOM APIs
- Includes React Testing Library setup
- Tests components, hooks, schemas, and client-side utilities

### `jest.config.db.js` - Backend Tests
- Uses Node.js environment
- Loads environment variables via dotenv
- Mocks Next.js server components
- Tests API routes and server-side logic

### `jest.config.all.js` - Comprehensive Testing
- Runs both frontend and backend tests in parallel
- Provides unified coverage reporting
- Uses Jest projects feature for multi-environment testing

### Setup Files

#### `jest.setup.js` - Frontend Setup
- Configures Testing Library DOM matchers
- Includes polyfills for web APIs (whatwg-fetch)

#### `jest.setup.backend.js` - Backend Setup
- Loads environment variables from .env
- Sets up test database configuration
- Mocks Next.js server modules
- Configures extended timeouts for database operations

## File Organization

```
src/
├── components/          # React components
│   └── __tests__/       # Component tests (frontend)
├── hooks/               # Custom React hooks
│   └── __tests__/       # Hook tests (frontend)
├── shared/              # Shared schemas and utilities
│   └── __tests__/       # Schema tests (frontend)
├── utils/               # Client-side utilities
│   └── __tests__/       # Utility tests (frontend)
├── lib/                 # Server-side libraries
│   └── __tests__/       # Library tests (backend)
└── app/api/             # Next.js API routes
    └── **/__tests__/    # API route tests (backend)
```

## Best Practices

1. **Environment Separation**: Keep frontend and backend tests separate to avoid environment conflicts
2. **Test Naming**: Use `.test.ts` for backend and `.test.tsx` for frontend React components
3. **Mock Strategy**: Mock external dependencies appropriately for each environment
4. **Database Tests**: Use test databases and proper cleanup to avoid data pollution
5. **API Testing**: Mock Next.js server components when testing API routes in isolation

## Example Test Files

### Frontend Component Test
```typescript
// src/components/__tests__/Button.test.tsx
import { render, screen } from '@testing-library/react';
import Button from '../Button';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole('button')).toHaveTextContent('Click me');
});
```

### Backend API Route Test
```typescript
// src/app/api/users/__tests__/route.test.ts
import { GET } from '../route';

test('returns user data', async () => {
  const response = await GET();
  const data = await response.json();
  expect(data.users).toBeDefined();
});
```

## Troubleshooting

### Common Issues

1. **Environment Variables**: Ensure `.env` file is properly loaded in backend tests
2. **Module Resolution**: Check that path aliases are correctly configured in all Jest configs
3. **Timeouts**: Backend tests may need longer timeouts for database operations
4. **Mocking**: Verify that server-side modules are properly mocked in the Node.js environment

### Database Test Issues

If you encounter database-related test failures:
1. Ensure your test database supports the required operations
2. Use proper test isolation and cleanup
3. Consider mocking database operations for unit tests
4. Use integration test setup for actual database testing
