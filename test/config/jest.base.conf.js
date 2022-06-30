const path = require('path');

// To have consistent date time parsing both in local and CI environments we set
// the timezone of the Node process.
process.env.TZ = 'Asia/Shanghai';

module.exports = {
  rootDir: path.resolve(__dirname, '../../'),
  setupFilesAfterEnv: ['./test/scripts/setup-framework.js', 'jest-canvas-mock'],
  testEnvironment: 'jsdom',
  preset: 'ts-jest',
  transform: {
    '^.+\\.(j|t)sx?$': 'babel-jest',
    '^.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
  },
  transformIgnorePatterns: ['node_modules'],
  verbose: false,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverage: true,
  coverageReporters: ['json', 'html'],
  testURL: 'http://localhost/',
  testPathIgnorePatterns: ['/node_modules/', '.history', '<rootDir>/src/_common'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.json',
      babelConfig: true,
    },
  },
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{ts,tsx,js,jsx}',
    '!**/node_modules/**',
    '!**/_common/**',
    '!**/__tests__/**',
    '!**/style/**',
    '!**/coverage/**',
  ],
  moduleNameMapper: {
    // 测试工具便捷引入
    '^@test/(.*)': '<rootDir>/test/$1',
    // 组件 alias
    '^tdesign-react/es': '<rootDir>/src',
    '^tdesign-react(.*)': '<rootDir>/src$1',
    // common
    "^@common/(.*)": "<rootDir>/src/_common/$1",
  },
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
};
