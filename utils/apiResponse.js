const sendSuccess = (res, statusCode, message, data) => {
  const response = {
    success: true,
    message,
  };

  if (data !== undefined) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

const sendError = (res, statusCode, message, errors) => {
  const response = {
    success: false,
    message,
  };

  if (errors && errors.length > 0) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

const formatMongooseErrors = (error) => {
  if (error.name === 'ValidationError') {
    return Object.values(error.errors).map((err) => err.message);
  }

  return [error.message];
};

const handleDuplicateKeyError = (error) => {
  const field = Object.keys(error.keyPattern)[0];
  const fieldLabel = field ? field.toUpperCase() : 'FIELD';

  return {
    statusCode: 409,
    message: `Duplicate ${field} value`,
    errors: [`${fieldLabel} already exists`],
  };
};

module.exports = {
  sendSuccess,
  sendError,
  formatMongooseErrors,
  handleDuplicateKeyError,
};
