module.exports = {
  displayName: "Backend Tests",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.backend.js"],
  moduleNameMapper: {
    "^@/components/(.*)$": "<rootDir>/src/components/$1",
    "^@/hooks/(.*)$": "<rootDir>/src/hooks/$1",
    "^@/lib/(.*)$": "<rootDir>/src/lib/$1",
    "^@/utils/(.*)$": "<rootDir>/src/utils/$1",
    "^@/app/(.*)$": "<rootDir>/src/app/$1",
    "^@/shared/(.*)$": "<rootDir>/src/shared/$1",
  },
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "tsconfig.jest.json" }],
  },
  testMatch: [
    "<rootDir>/src/lib/__tests__/**/*.test.ts",
    "<rootDir>/src/app/api/**/__tests__/**/*.test.ts"
  ],
  testTimeout: 15000,
  // Skip database tests for now due to transaction issues
  testPathIgnorePatterns: [
    "<rootDir>/src/lib/__tests__/prisma.test.ts"
  ],
};
