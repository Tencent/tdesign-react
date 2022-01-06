// / <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */

const path = require("path");
const { startDevServer } = require("@cypress/vite-dev-server");
const codeCoverageTask = require("@cypress/code-coverage/task");
const istanbul = require("vite-plugin-istanbul");

module.exports = (on, config) => {
  on("dev-server:start", (options) => startDevServer({
    options,
    viteConfig: {
      logLevel: "warn",
      configFile: path.resolve(__dirname, '../../../../site/vite.config.js'),
      plugins: [istanbul({
        include: ['src/**/_example/*.spec.*'],
        extension: ['.js', '.ts', '.jsx', '.tsx'],
        requireEnv: false,
        cypress: true,
      })],
    },
  })
  );

  codeCoverageTask(on, config);
  return config;
};
