const { join } = require('path');
const { DefinePlugin } = require('webpack');

const supportedEnvVariablesPattern = /^CAT_FOSTERING_|ORY_/i;

function getClientEnvironment() {
  const env = {
    production: process.env.NODE_ENV === 'production',
  };
  for (const key in process.env) {
    if (supportedEnvVariablesPattern.test(key)) {
      env[`process.env.${key}`] = JSON.stringify(process.env[key]);
    }
  }
  return env;
}

// module.exports = (config, options, context) => {
//   // Overwrite the mode set by Angular if the NODE_ENV is set
//   config.mode = process.env.NODE_ENV || config.mode;
//   config.plugins ??= [];
//   config.plugins.push(new DefinePlugin(getClientEnvironment()));
//   return config;
// };

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  mode: ['development', 'production'].includes(process.env.NODE_ENV)
    ? process.env.NODE_ENV
    : 'none',
  output: {
    path: join(__dirname, '../../dist/apps/cat-fostering-web'),
  },
  plugins: [new DefinePlugin(getClientEnvironment())],
};
