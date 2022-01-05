const baseConfig = require('./jest.base.conf.js');

module.exports = {
  ...baseConfig,
  testRegex: 'test/ssr/.*\\.test\\.js$',
};
