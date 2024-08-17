const { DefinePlugin } = require('webpack');

const myOrgEnvRegex = /^CAT_FOSTERING_|ORY_/i;

function getClientEnvironment() {
  const envVars = {
    production: process.env.NODE_ENV === 'production',
  };
  for (const key in process.env) {
    if (myOrgEnvRegex.test(key)) {
      envVars[key] = process.env[key];
    }
  }

  return {
    'process.env': JSON.stringify(envVars),
  };
}

module.exports = (config, options, context) => {
  // Overwrite the mode set by Angular if the NODE_ENV is set
  config.mode = process.env.NODE_ENV || config.mode;
  config.plugins ??= [];
  config.plugins.push(new DefinePlugin(getClientEnvironment()));
  return config;
};
