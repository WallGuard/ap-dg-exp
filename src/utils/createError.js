const { StatusCodes } = require('http-status-codes');

const { validationErrorName } = require('./constants');

/**
 * @param {any} message
 * @param {object} params
 */
const createError = (message, params = {}) => {
  const error = { message };

  Object.keys(params).forEach((key) => {
    error[key] = params[key];
  });

  error.code = params.code || StatusCodes.BAD_REQUEST;
  error.type = 'custom';

  return error;
};

/**
 * @param {{
    path: string;
    message: string;
 * }[]} errors
 */
const createValidationErrorBody = (errors) => {
  return {
    name: validationErrorName,
    errors,
  };
};

module.exports = {
  createError,
  createValidationErrorBody,
};
