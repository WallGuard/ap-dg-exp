/* eslint-disable no-console */
const env = process.env.NODE_ENV || 'development';

const logColors = {
  info: '\x1b[36m%s\x1b[0m',
  warn: '\x1b[33m%s\x1b[0m',
  error: '\x1b[31m%s\x1b[0m',
};

const noInfoLogEnvsList = ['production', 'stage', 'test'];
const noWarnLogEnvsList = noInfoLogEnvsList;
const hideInfo = noInfoLogEnvsList.includes(env);
const hideWarn = noWarnLogEnvsList.includes(env);
const hideError = env === 'test';

const logger = {
  info: (...args) => {
    if (hideInfo) { return; }

    console.log(logColors.info, '   INFO: ', ...args);
  },
  subInfo: (...args) => {
    if (hideInfo) { return; }

    console.error(logColors.info, '      || ', ...args);
  },
  warn: (...args) => {
    if (hideWarn) { return; }

    console.warn(logColors.warn, 'WARNING: ', ...args);
  },
  subWarn: (...args) => {
    if (hideWarn) { return; }

    console.warn(logColors.warn, '      || ', ...args);
  },
  error: (...args) => {
    if (hideError) { return; }

    console.error(logColors.error, '  ERROR: ', ...args);
  },
  subError: (...args) => {
    if (hideError) { return; }

    console.error(logColors.error, '      || ', ...args);
  },
};

module.exports = logger;
