const baseConfig = require('./jest.base.conf.js');

module.exports = {
  ...baseConfig,
  coverageDirectory: '<rootDir>/test/ssr/coverage',
  modulePathIgnorePatterns: ['<rootDir>/test/ssr/coverage/'],
  testRegex: 'test/ssr/.*\\.test\\.js$',
};
