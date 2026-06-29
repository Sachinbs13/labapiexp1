const Student = require('../models/Student');
const { sendError, formatMongooseErrors } = require('../utils/apiResponse');

const REQUIRED_FIELDS = [
  'name',
  'usn',
  'email',
  'phone',
  'branch',
  'semester',
  'cgpa',
  'age',
  'gender',
  'address',
];

const FORBIDDEN_FIELDS = ['_id', '__v', 'createdAt', 'updatedAt'];

const normalizeBody = (body) => {
  const normalized = { ...body };

  if (normalized.name !== undefined) {
    normalized.name = String(normalized.name).trim();
  }

  if (normalized.usn !== undefined) {
    normalized.usn = String(normalized.usn).trim().toUpperCase();
  }

  if (normalized.email !== undefined) {
    normalized.email = String(normalized.email).trim().toLowerCase();
  }

  if (normalized.phone !== undefined) {
    normalized.phone = String(normalized.phone).trim();
  }

  if (normalized.branch !== undefined) {
    normalized.branch = String(normalized.branch).trim();
  }

  if (normalized.address !== undefined) {
    normalized.address = String(normalized.address).trim();
  }

  if (normalized.gender !== undefined) {
    normalized.gender = String(normalized.gender).trim();
  }

  if (normalized.semester !== undefined) {
    normalized.semester = Number(normalized.semester);
  }

  if (normalized.cgpa !== undefined) {
    normalized.cgpa = Number(normalized.cgpa);
  }

  if (normalized.age !== undefined) {
    normalized.age = Number(normalized.age);
  }

  return normalized;
};

const getMissingRequiredFields = (body) => {
  return REQUIRED_FIELDS.filter((field) => {
    const value = body[field];
    return value === undefined || value === null || value === '';
  }).map((field) => `${field} is required`);
};

const getInvalidNumberFields = (body, fields) => {
  return fields
    .filter((field) => body[field] !== undefined && Number.isNaN(body[field]))
    .map((field) => `${field} must be a valid number`);
};

const getUnknownFields = (body) => {
  return Object.keys(body)
    .filter((field) => !REQUIRED_FIELDS.includes(field))
    .map((field) => `Unknown field: ${field}`);
};

const runMongooseValidation = async (body, paths = null) => {
  const student = new Student(body);

  if (paths && paths.length > 0) {
    await student.validate(paths);
    return;
  }

  await student.validate();
};

const validateCreateStudent = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return sendError(res, 400, 'Request body is required', [
        'Please provide student data in the request body',
      ]);
    }

    const unknownFields = getUnknownFields(req.body);
    if (unknownFields.length > 0) {
      return sendError(res, 422, 'Validation failed', unknownFields);
    }

    const missingFields = getMissingRequiredFields(req.body);
    if (missingFields.length > 0) {
      return sendError(res, 422, 'Validation failed', missingFields);
    }

    req.body = normalizeBody(req.body);

    const numberErrors = getInvalidNumberFields(req.body, ['semester', 'cgpa', 'age']);
    if (numberErrors.length > 0) {
      return sendError(res, 422, 'Validation failed', numberErrors);
    }

    await runMongooseValidation(req.body);
    next();
  } catch (error) {
    if (error.name === 'ValidationError') {
      return sendError(res, 422, 'Validation failed', formatMongooseErrors(error));
    }

    next(error);
  }
};

const validateUpdateStudent = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return sendError(res, 400, 'Request body is required', [
        'Please provide all student fields for a full update',
      ]);
    }

    const forbiddenFields = Object.keys(req.body).filter((field) =>
      FORBIDDEN_FIELDS.includes(field)
    );

    if (forbiddenFields.length > 0) {
      return sendError(res, 400, 'Validation failed', [
        `Cannot update fields: ${forbiddenFields.join(', ')}`,
      ]);
    }

    const unknownFields = getUnknownFields(req.body);
    if (unknownFields.length > 0) {
      return sendError(res, 422, 'Validation failed', unknownFields);
    }

    const missingFields = getMissingRequiredFields(req.body);
    if (missingFields.length > 0) {
      return sendError(res, 422, 'Validation failed', missingFields);
    }

    req.body = normalizeBody(req.body);

    const numberErrors = getInvalidNumberFields(req.body, ['semester', 'cgpa', 'age']);
    if (numberErrors.length > 0) {
      return sendError(res, 422, 'Validation failed', numberErrors);
    }

    await runMongooseValidation(req.body);
    next();
  } catch (error) {
    if (error.name === 'ValidationError') {
      return sendError(res, 422, 'Validation failed', formatMongooseErrors(error));
    }

    next(error);
  }
};

const validatePatchStudent = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return sendError(res, 400, 'Request body is required', [
        'Provide at least one field to update',
      ]);
    }

    const forbiddenFields = Object.keys(req.body).filter((field) =>
      FORBIDDEN_FIELDS.includes(field)
    );

    if (forbiddenFields.length > 0) {
      return sendError(res, 400, 'Validation failed', [
        `Cannot update fields: ${forbiddenFields.join(', ')}`,
      ]);
    }

    const unknownFields = getUnknownFields(req.body);
    if (unknownFields.length > 0) {
      return sendError(res, 422, 'Validation failed', unknownFields);
    }

    req.body = normalizeBody(req.body);

    const numberFields = ['semester', 'cgpa', 'age'].filter((field) => req.body[field] !== undefined);
    const numberErrors = getInvalidNumberFields(req.body, numberFields);

    if (numberErrors.length > 0) {
      return sendError(res, 422, 'Validation failed', numberErrors);
    }

    await runMongooseValidation(req.body, Object.keys(req.body));
    next();
  } catch (error) {
    if (error.name === 'ValidationError') {
      return sendError(res, 422, 'Validation failed', formatMongooseErrors(error));
    }

    next(error);
  }
};

module.exports = {
  validateCreateStudent,
  validateUpdateStudent,
  validatePatchStudent,
};
