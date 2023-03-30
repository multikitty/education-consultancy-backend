const httpStatus = require('http-status');
const expressValidation = require('express-validation');
const APIError = require('../utils/APIError');
const { env } = require('../../config/vars');
const { check } = require('express-validator')

/**
 * Error handler. Send stacktrace only during development
 * @public
 */
const handler = (err, req, res, next) => {
  const response = {
    code: err.status,
    message: err.message || httpStatus[err.status],
    errors: err.errors,
    stack: err.stack,
  };

  if (env !== 'development') {
    delete response.stack;
  }

  res.status(err.status);
  res.json(response);
};
exports.handler = handler;

/**
 * If error is not an instanceOf APIError, convert it.
 * @public
 */
exports.converter = (err, req, res, next) => {
  let convertedError = err;

  if (err instanceof expressValidation.ValidationError) {
    convertedError = new APIError({
      message: 'Erro de Validação',
      errors: err.errors,
      status: err.status,
      stack: err.stack,
    });
  } else if (!(err instanceof APIError)) {
    convertedError = new APIError({
      message: err.message,
      status: err.status,
      stack: err.stack,
    });
  }

  return handler(convertedError, req, res);
};

/**
 * Catch 404 and forward to error handler
 * @public
 */
exports.notFound = (req, res, next) => {
  const err = new APIError({
    message: 'We can not find something similar to this',
    status: httpStatus.NOT_FOUND,
  });
  return handler(err, req, res);
};

/**
 * Catch 422 for duplicate key
 * @public
 */
exports.checkDuplicate = (err, res, name = '') => {
  if (err.code === 11000 || err.code === 11001) {
    let message = `${name} with same `;
    if (err.errmsg.includes('email_1'))
      message += 'email already exists';
    else {
      const pathRegex = err.message.match(/\.\$([a-z]+)/)
      const path = pathRegex ? pathRegex[1] : '';
      const keyRegex = err.message.match(/key:\s+{\s+:\s\"(.*)(?=\")/)
      const key = keyRegex ? keyRegex[1] : '';
      message = `'${path}' '${key}' already exists`;
    }
    return res.status(200).send({ success: false, message });
  }
};

exports.validationOptions = [
  check('name', 'Name should be atleast me 3 characters long')
      .exists()
      .isLength({ min: 3 }),
  check('email', 'Invalid Email')
      .isEmail()
      .normalizeEmail(),
  check('password', 'Password should be atleast 8 characters long')
      .exists()
      .isLength({ min: 8 }),
  check(
      'confirmpassword','Passwords do not match')
      .exists()
      .custom((value, { req }) => value === req.body.password),
  check(
    'status','Status is required')
    .exists()  
      
]