const mongoose = require('mongoose');
const Student = require('../models/Student');
const {
  sendSuccess,
  sendError,
  formatMongooseErrors,
  handleDuplicateKeyError,
} = require('../utils/apiResponse');
const { buildStudentQuery } = require('../utils/buildStudentQuery');

const getStudents = async (req, res) => {
  try {
    const { errors, filter, sort, page, limit, skip, projection } = buildStudentQuery(req.query);

    if (errors.length > 0) {
      return sendError(res, 400, 'Invalid query parameters', errors);
    }

    const query = Student.find(filter).sort(sort).skip(skip).limit(limit);

    if (projection) {
      query.select(projection);
    }

    const [students, total] = await Promise.all([
      query.lean(),
      Student.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return sendSuccess(res, 200, 'Students fetched successfully', {
      count: students.length,
      total,
      page,
      limit,
      totalPages,
      students,
    });
  } catch (error) {
    return sendError(res, 500, 'Failed to fetch students', [error.message]);
  }
};

const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 400, 'Invalid student ID', ['Please provide a valid MongoDB ObjectId']);
    }

    const student = await Student.findById(id);

    if (!student) {
      return sendError(res, 404, 'Student not found', ['No student exists with the given ID']);
    }

    return sendSuccess(res, 200, 'Student fetched successfully', { student });
  } catch (error) {
    return sendError(res, 500, 'Failed to fetch student', [error.message]);
  }
};

const createStudent = async (req, res) => {
  try {
    const student = await Student.create(req.body);

    return sendSuccess(res, 201, 'Student created successfully', { student });
  } catch (error) {
    if (error.code === 11000) {
      const duplicateError = handleDuplicateKeyError(error);
      return sendError(res, duplicateError.statusCode, duplicateError.message, duplicateError.errors);
    }

    if (error.name === 'ValidationError') {
      return sendError(res, 422, 'Validation failed', formatMongooseErrors(error));
    }

    return sendError(res, 500, 'Failed to create student', [error.message]);
  }
};

const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 400, 'Invalid student ID', ['Please provide a valid MongoDB ObjectId']);
    }

    const student = await Student.findOneAndReplace({ _id: id }, req.body, {
      new: true,
      runValidators: true,
    });

    if (!student) {
      return sendError(res, 404, 'Student not found', ['No student exists with the given ID']);
    }

    return sendSuccess(res, 200, 'Student updated successfully', { student });
  } catch (error) {
    if (error.code === 11000) {
      const duplicateError = handleDuplicateKeyError(error);
      return sendError(res, duplicateError.statusCode, duplicateError.message, duplicateError.errors);
    }

    if (error.name === 'ValidationError') {
      return sendError(res, 422, 'Validation failed', formatMongooseErrors(error));
    }

    return sendError(res, 500, 'Failed to update student', [error.message]);
  }
};

const patchStudent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 400, 'Invalid student ID', ['Please provide a valid MongoDB ObjectId']);
    }

    const student = await Student.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!student) {
      return sendError(res, 404, 'Student not found', ['No student exists with the given ID']);
    }

    return sendSuccess(res, 200, 'Student patched successfully', { student });
  } catch (error) {
    if (error.code === 11000) {
      const duplicateError = handleDuplicateKeyError(error);
      return sendError(res, duplicateError.statusCode, duplicateError.message, duplicateError.errors);
    }

    if (error.name === 'ValidationError') {
      return sendError(res, 422, 'Validation failed', formatMongooseErrors(error));
    }

    return sendError(res, 500, 'Failed to patch student', [error.message]);
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 400, 'Invalid student ID', ['Please provide a valid MongoDB ObjectId']);
    }

    const student = await Student.findByIdAndDelete(id);

    if (!student) {
      return sendError(res, 404, 'Student not found', ['No student exists with the given ID']);
    }

    return sendSuccess(res, 200, 'Student deleted successfully', { student });
  } catch (error) {
    return sendError(res, 500, 'Failed to delete student', [error.message]);
  }
};

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  patchStudent,
  deleteStudent,
};
