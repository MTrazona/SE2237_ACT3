/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js'],
    testMatch: ['**/test/**/*.test.ts'], // Adjust this if your tests are elsewhere
    globals: {
      'ts-jest': {
        isolatedModules: true,
      },
    },
  };
  