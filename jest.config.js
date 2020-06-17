module.exports = {
  setupFilesAfterEnv: ['./test/setup-framework.js'],
  transform: {
    '^.+\\.(j|t)sx?$': 'babel-jest',
  },
  transformIgnorePatterns: ['node_modules/?!(popper.js)'],
  verbose: false,
  moduleNameMapper: {
    // 测试工具便捷引入
    '^@test/(.*)': '<rootDir>/test/$1',
    // 组件 alias
    '^@tdesign/react(.*)': '<rootDir>/src$1',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverage: true,
  coverageReporters: ['json', 'html'],
  testMatch: ['<rootDir>/src/**/__tests__/**/*.test.{ts,tsx}'],
};
