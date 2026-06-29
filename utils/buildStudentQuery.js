const ALLOWED_SORT_FIELDS = [
  'name',
  'usn',
  'email',
  'phone',
  'branch',
  'semester',
  'cgpa',
  'age',
  'gender',
  'createdAt',
  'updatedAt',
];

const ALLOWED_SELECT_FIELDS = [
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
  'createdAt',
  'updatedAt',
];

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const parsePositiveInt = (value, fallback) => {
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) || parsed < 1 ? fallback : parsed;
};

const buildStudentQuery = (queryParams) => {
  const errors = [];
  const filter = {};

  if (queryParams.search) {
    const search = escapeRegex(queryParams.search.trim());

    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { usn: { $regex: search, $options: 'i' } },
    ];
  }

  if (queryParams.branch) {
    const branch = escapeRegex(queryParams.branch.trim());
    filter.branch = { $regex: `^${branch}$`, $options: 'i' };
  }

  if (queryParams.semester !== undefined) {
    const semester = Number(queryParams.semester);

    if (Number.isNaN(semester)) {
      errors.push('semester must be a valid number');
    } else if (semester < 1 || semester > 8) {
      errors.push('semester must be between 1 and 8');
    } else {
      filter.semester = semester;
    }
  }

  if (queryParams.cgpa !== undefined) {
    const cgpa = Number(queryParams.cgpa);

    if (Number.isNaN(cgpa)) {
      errors.push('cgpa must be a valid number');
    } else if (cgpa < 0 || cgpa > 10) {
      errors.push('cgpa must be between 0 and 10');
    } else {
      filter.cgpa = cgpa;
    }
  } else {
    const cgpaFilter = {};

    if (queryParams.minCgpa !== undefined) {
      const minCgpa = Number(queryParams.minCgpa);

      if (Number.isNaN(minCgpa)) {
        errors.push('minCgpa must be a valid number');
      } else if (minCgpa < 0 || minCgpa > 10) {
        errors.push('minCgpa must be between 0 and 10');
      } else {
        cgpaFilter.$gte = minCgpa;
      }
    }

    if (queryParams.maxCgpa !== undefined) {
      const maxCgpa = Number(queryParams.maxCgpa);

      if (Number.isNaN(maxCgpa)) {
        errors.push('maxCgpa must be a valid number');
      } else if (maxCgpa < 0 || maxCgpa > 10) {
        errors.push('maxCgpa must be between 0 and 10');
      } else {
        cgpaFilter.$lte = maxCgpa;
      }
    }

    if (Object.keys(cgpaFilter).length > 0) {
      filter.cgpa = cgpaFilter;
    }
  }

  let sort = { createdAt: -1 };

  if (queryParams.sort) {
    const sortValue = queryParams.sort.trim();
    const isDescending = sortValue.startsWith('-');
    const sortField = isDescending ? sortValue.slice(1) : sortValue;

    if (!ALLOWED_SORT_FIELDS.includes(sortField)) {
      errors.push(`sort must be one of: ${ALLOWED_SORT_FIELDS.join(', ')}`);
    } else {
      sort = { [sortField]: isDescending ? -1 : 1 };
    }
  }

  const page = parsePositiveInt(queryParams.page, 1);
  const limit = Math.min(100, parsePositiveInt(queryParams.limit, 10));
  const skip = (page - 1) * limit;

  let projection = null;

  if (queryParams.fields) {
    const requestedFields = queryParams.fields
      .split(',')
      .map((field) => field.trim())
      .filter(Boolean);

    const invalidFields = requestedFields.filter(
      (field) => !ALLOWED_SELECT_FIELDS.includes(field)
    );

    if (invalidFields.length > 0) {
      errors.push(`Invalid fields: ${invalidFields.join(', ')}`);
    } else if (requestedFields.length > 0) {
      projection = requestedFields.reduce((acc, field) => {
        acc[field] = 1;
        return acc;
      }, {});
    }
  }

  return {
    errors,
    filter,
    sort,
    page,
    limit,
    skip,
    projection,
  };
};

module.exports = {
  buildStudentQuery,
  ALLOWED_SORT_FIELDS,
  ALLOWED_SELECT_FIELDS,
};
