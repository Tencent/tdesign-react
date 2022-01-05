const baseConfig = require('./jest.base.conf.js');

module.exports = {
  ...baseConfig,
  coverageDirectory: '<rootDir>/test/unit/coverage',
  modulePathIgnorePatterns: ['<rootDir>/test/unit/coverage/'],
  moduleNameMapper: {
    // 测试工具便捷引入
    '^@test/(.*)': '<rootDir>/test/$1',
    // 组件 alias
    '^tdesign-react(.*)': '<rootDir>/src$1',
  },
  testMatch: ['<rootDir>/src/**/__tests__/**/*.test.{ts,tsx}'],
};
