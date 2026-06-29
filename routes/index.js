const express = require('express');
const studentRoutes = require('./studentRoutes');

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Student Management API',
    data: {
      version: '1.0.0',
      endpoints: {
        students: {
          list: 'GET /api/students',
          getOne: 'GET /api/students/:id',
          create: 'POST /api/students',
          update: 'PUT /api/students/:id',
          patch: 'PATCH /api/students/:id',
          delete: 'DELETE /api/students/:id',
          queryParams: {
            search: 'Search by name or USN',
            branch: 'Filter by branch',
            semester: 'Filter by semester (1-8)',
            cgpa: 'Filter by exact CGPA',
            minCgpa: 'Filter by minimum CGPA',
            maxCgpa: 'Filter by maximum CGPA',
            sort: 'Sort field (prefix with - for descending)',
            page: 'Page number (default: 1)',
            limit: 'Results per page (default: 10, max: 100)',
            fields: 'Comma-separated fields to return',
          },
        },
        health: 'GET /health',
      },
    },
  });
});

router.use('/students', studentRoutes);

module.exports = router;
