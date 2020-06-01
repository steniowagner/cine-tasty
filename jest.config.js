/* eslint-disable @typescript-eslint/no-var-requires */
const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.spec.ts'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      diagnostics: false,
    },
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/app.ts',
    '!src/graphql/datasources/index.ts',
    '!<rootDir>/node_modules/',
    '!<rootDir>/src/config/**/*.ts',
    '!<rootDir>/src/**/*.stub.ts',
  ],
  moduleDirectories: ['node_modules', 'src'],
  coverageThreshold: {
    global: {
      statements: 100,
      functions: 100,
      branches: 80,
      lines: 100,
    },
  },
  coverageReporters: ['html', 'text'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/src/',
  }),
  preset: 'ts-jest',
  testEnvironment: 'node',
};
