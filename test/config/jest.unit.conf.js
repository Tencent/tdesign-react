const baseConfig = require('./jest.base.conf.js');

process.env.TZ = 'Asia/Shanghai';

module.exports = {
  ...baseConfig,
  reporters: [
    'default',
    [
      './node_modules/jest-html-reporter',
      {
        pageTitle: 'TDesign Web React Test Report',
        outputPath: '<rootDir>/test/unit/coverage/test-report.html',
      },
    ],
  ],
  coverageDirectory: '<rootDir>/test/unit/coverage',
  modulePathIgnorePatterns: ['<rootDir>/test/unit/coverage/'],
  testMatch: ['<rootDir>/src/**/__tests__/**/*.test.{ts,tsx}'],
};
