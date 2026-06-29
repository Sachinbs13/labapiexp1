export const GENDER_OPTIONS = ['Male', 'Female', 'Other'];

export const BRANCH_OPTIONS = ['CSE', 'ISE', 'ECE', 'EEE', 'ME', 'CE', 'AIML', 'CSBS'];

export const SORT_OPTIONS = [
  { label: 'Newest first', value: '-createdAt' },
  { label: 'Oldest first', value: 'createdAt' },
  { label: 'Name (A-Z)', value: 'name' },
  { label: 'Name (Z-A)', value: '-name' },
  { label: 'CGPA (High-Low)', value: '-cgpa' },
  { label: 'CGPA (Low-High)', value: 'cgpa' },
];

export const INITIAL_STUDENT_FORM = {
  name: '',
  usn: '',
  email: '',
  phone: '',
  branch: '',
  semester: '',
  cgpa: '',
  age: '',
  gender: 'Male',
  address: '',
};

export const INITIAL_FILTERS = {
  search: '',
  branch: '',
  semester: '',
  minCgpa: '',
  maxCgpa: '',
  sort: '-createdAt',
  page: 1,
  limit: 10,
};
