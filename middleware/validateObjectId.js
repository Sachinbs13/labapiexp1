const mongoose = require('mongoose');
const { sendError } = require('../utils/apiResponse');

const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return sendError(res, 400, 'Invalid student ID', [
      'Please provide a valid MongoDB ObjectId',
    ]);
  }

  next();
};

module.exports = validateObjectId;
