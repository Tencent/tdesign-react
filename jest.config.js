const path = require('path');

process.env.TZ = 'Asia/Shanghai';

module.exports = {
  rootDir: path.resolve(__dirname, './'),
  setupFilesAfterEnv: ['./test/setup-framework.js'],
  testEnvironment: 'jsdom',
  preset: 'ts-jest',
  transform: {
    '^.+\\.(j|t)sx?$': 'babel-jest',
    '^.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
  },
  transformIgnorePatterns: ['node_modules'],
  verbose: false,
  moduleNameMapper: {
    // 测试工具便捷引入
    '^@test/(.*)': '<rootDir>/test/$1',
    // 组件 alias
    '^tdesign-react(.*)': '<rootDir>/src$1',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverage: true,
  coverageReporters: ['json', 'html'],
  testMatch: ['<rootDir>/src/**/__tests__/**/*.test.{ts,tsx}'],
};
