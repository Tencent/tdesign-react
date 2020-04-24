// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html
const path = require('path')

module.exports = {
    clearMocks: true,
    collectCoverageFrom: [
        '<rootDir>/src/**/*.{ts,tsx}',
        '!<rootDir>/src/**/__tests__/**/*',
    ],
    coverageReporters: ['html', 'text-summary', 'json', 'clover', 'json-summary'],
    coverageDirectory: '<rootDir>/coverage/jest/',
    reporters: ['default'],
    rootDir: __dirname,
    testMatch: [
        '<rootDir>/src/**/__tests__/**/*.test.{ts,tsx}',
    ],
    moduleNameMapper: {},
    moduleDirectories: ['node_modules'],
    watchPathIgnorePatterns: [
        'buildCache',
        'node_modules',
    ],
    setupFiles: [],
};
