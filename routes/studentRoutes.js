const express = require('express');
const {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  patchStudent,
  deleteStudent,
} = require('../controllers/studentController');
const validateObjectId = require('../middleware/validateObjectId');
const {
  validateCreateStudent,
  validateUpdateStudent,
  validatePatchStudent,
} = require('../middleware/validateStudent');

const router = express.Router();

router.route('/').get(getStudents).post(validateCreateStudent, createStudent);

router
  .route('/:id')
  .get(validateObjectId, getStudentById)
  .put(validateObjectId, validateUpdateStudent, updateStudent)
  .patch(validateObjectId, validatePatchStudent, patchStudent)
  .delete(validateObjectId, deleteStudent);

module.exports = router;
