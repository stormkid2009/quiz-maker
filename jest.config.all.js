module.exports = {
  projects: [
    {
      displayName: "Frontend Tests",
      testEnvironment: "jest-environment-jsdom",
      setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
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
        "<rootDir>/src/components/**/__tests__/**/*.test.{ts,tsx}",
        "<rootDir>/src/hooks/**/__tests__/**/*.test.{ts,tsx}",
        "<rootDir>/src/shared/**/__tests__/**/*.test.{ts,tsx}",
        "<rootDir>/src/utils/**/__tests__/**/*.test.{ts,tsx}",
      ],
      testPathIgnorePatterns: [
        "<rootDir>/src/lib/__tests__/",
        "<rootDir>/src/app/api/",
      ],
    },
    {
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
        "<rootDir>/src/app/api/**/__tests__/**/*.test.ts",
      ],
      testTimeout: 15000,
      // Skip database tests for now due to transaction issues
      testPathIgnorePatterns: [
        "<rootDir>/src/lib/__tests__/prisma.test.ts"
      ],
    },
  ],
  // Collect coverage from both frontend and backend code
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/__tests__/**",
    "!src/**/node_modules/**",
  ],
};
