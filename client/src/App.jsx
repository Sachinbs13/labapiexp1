import { useCallback, useEffect, useState } from 'react';
import Alert from './components/Alert';
import ConfirmDialog from './components/ConfirmDialog';
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';
import Pagination from './components/Pagination';
import SearchFilters from './components/SearchFilters';
import StudentForm from './components/StudentForm';
import StudentTable from './components/StudentTable';
import { INITIAL_FILTERS, INITIAL_STUDENT_FORM } from './constants/student';
import {
  createStudent,
  deleteStudent,
  getStudents,
  updateStudent,
} from './services/studentService';

const formatStudentPayload = (formData) => ({
  name: formData.name.trim(),
  usn: formData.usn.trim(),
  email: formData.email.trim(),
  phone: formData.phone.trim(),
  branch: formData.branch,
  semester: Number(formData.semester),
  cgpa: Number(formData.cgpa),
  age: Number(formData.age),
  gender: formData.gender,
  address: formData.address.trim(),
});

const mapStudentToForm = (student) => ({
  name: student.name || '',
  usn: student.usn || '',
  email: student.email || '',
  phone: student.phone || '',
  branch: student.branch || '',
  semester: String(student.semester ?? ''),
  cgpa: String(student.cgpa ?? ''),
  age: String(student.age ?? ''),
  gender: student.gender || 'Male',
  address: student.address || '',
});

function App() {
  const [students, setStudents] = useState([]);
  const [draftFilters, setDraftFilters] = useState(INITIAL_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(INITIAL_FILTERS);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [formData, setFormData] = useState(INITIAL_STUDENT_FORM);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [alert, setAlert] = useState({ variant: 'info', message: '', errors: [] });

  const clearAlert = () => setAlert({ variant: 'info', message: '', errors: [] });

  const showError = (error) => {
    setAlert({
      variant: 'error',
      message: error.message || 'Something went wrong',
      errors: error.errors || [],
    });
  };

  const showSuccess = (message) => {
    setAlert({ variant: 'success', message, errors: [] });
  };

  const fetchStudents = useCallback(async (queryFilters) => {
    setLoading(true);
    clearAlert();

    try {
      const response = await getStudents(queryFilters);
      setStudents(response.data.students || []);
      setPagination({
        page: response.data.page || 1,
        totalPages: response.data.totalPages || 1,
        total: response.data.total || 0,
      });
    } catch (error) {
      showError(error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents(appliedFilters);
  }, [appliedFilters, fetchStudents]);

  const handleSearch = () => {
    setAppliedFilters({ ...draftFilters, page: 1 });
  };

  const handleResetFilters = () => {
    setDraftFilters(INITIAL_FILTERS);
    setAppliedFilters(INITIAL_FILTERS);
  };

  const handlePageChange = (nextPage) => {
    setAppliedFilters((prev) => ({ ...prev, page: nextPage }));
  };

  const openCreateForm = () => {
    clearAlert();
    setFormMode('create');
    setSelectedStudent(null);
    setFormData(INITIAL_STUDENT_FORM);
    setFormOpen(true);
  };

  const openEditForm = (student) => {
    clearAlert();
    setFormMode('edit');
    setSelectedStudent(student);
    setFormData(mapStudentToForm(student));
    setFormOpen(true);
  };

  const closeForm = () => {
    if (!formLoading) {
      setFormOpen(false);
      setSelectedStudent(null);
      setFormData(INITIAL_STUDENT_FORM);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setFormLoading(true);
    clearAlert();

    try {
      const payload = formatStudentPayload(formData);

      if (formMode === 'create') {
        await createStudent(payload);
        showSuccess('Student created successfully');
      } else {
        await updateStudent(selectedStudent._id, payload);
        showSuccess('Student updated successfully');
      }

      setFormOpen(false);
      setSelectedStudent(null);
      setFormData(INITIAL_STUDENT_FORM);
      fetchStudents(appliedFilters);
    } catch (error) {
      showError(error);
    } finally {
      setFormLoading(false);
    }
  };

  const openDeleteDialog = (student) => {
    clearAlert();
    setSelectedStudent(student);
    setDeleteOpen(true);
  };

  const closeDeleteDialog = () => {
    if (!deleteLoading) {
      setDeleteOpen(false);
      setSelectedStudent(null);
    }
  };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    clearAlert();

    try {
      await deleteStudent(selectedStudent._id);
      showSuccess('Student deleted successfully');
      setDeleteOpen(false);
      setSelectedStudent(null);
      fetchStudents(appliedFilters);
    } catch (error) {
      showError(error);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Students</h2>
            <p className="text-sm text-slate-500">Manage student records via the REST API</p>
          </div>
          <button
            type="button"
            onClick={openCreateForm}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            + Add Student
          </button>
        </div>

        <Alert
          variant={alert.variant}
          message={alert.message}
          errors={alert.errors}
          onClose={clearAlert}
        />

        <SearchFilters
          filters={draftFilters}
          onChange={setDraftFilters}
          onSearch={handleSearch}
          onReset={handleResetFilters}
        />

        {loading ? (
          <LoadingSpinner label="Fetching students..." />
        ) : (
          <>
            <StudentTable
              students={students}
              onEdit={openEditForm}
              onDelete={openDeleteDialog}
            />
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </main>

      <StudentForm
        open={formOpen}
        mode={formMode}
        formData={formData}
        loading={formLoading}
        onChange={setFormData}
        onSubmit={handleFormSubmit}
        onClose={closeForm}
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Delete Student"
        message={
          selectedStudent
            ? `Are you sure you want to delete ${selectedStudent.name} (${selectedStudent.usn})?`
            : 'Are you sure you want to delete this student?'
        }
        onConfirm={handleDeleteConfirm}
        onCancel={closeDeleteDialog}
        loading={deleteLoading}
      />
    </div>
  );
}

export default App;
