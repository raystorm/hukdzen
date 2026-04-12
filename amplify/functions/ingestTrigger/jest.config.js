module.exports = {
   preset: 'ts-jest',
   testEnvironment: 'node',
   testMatch: ['**/__tests__/**/*.test.ts'],
   transformIgnorePatterns: [
      'node_modules/(?!(@aws-sdk|@smithy)/)',
   ],
   moduleNameMapper: {
      '^(\\.{1,2}/.*)\\.js$': '$1',
   },
};
