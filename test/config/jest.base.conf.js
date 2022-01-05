const path = require('path');

// To have consistent date time parsing both in local and CI environments we set
// the timezone of the Node process.
process.env.TZ = 'Asia/Shanghai';

module.exports = {
  verbose: true,
  rootDir: path.resolve(__dirname, '../../'),
  testURL: 'http://localhost/',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    // 测试工具便捷引入
    '^@test/(.*)': '<rootDir>/test/$1',
    // 组件 alias
    '^tdesign-react(.*)': '<rootDir>/src$1',
    '^tdesign-icons-react$': '<rootDir>/node_modules/tdesign-icons-react/dist/index.js',
  },
  preset: 'ts-jest',
  transform: {
    '^.+\\.(j|t)sx?$': 'babel-jest',
    '^.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
  },
  transformIgnorePatterns: ['node_modules'],
  testPathIgnorePatterns: ['/node_modules/', '.history', '<rootDir>/src/_common'],
  setupFiles: ['<rootDir>/test/scripts/setup-framework'],
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
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
  testEnvironment: 'jsdom',
};
