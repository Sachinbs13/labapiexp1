import { BRANCH_OPTIONS, GENDER_OPTIONS } from '../constants/student';

const INPUT_CLASS =
  'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100';

function StudentForm({ open, mode, formData, loading, onChange, onSubmit, onClose }) {
  if (!open) {
    return null;
  }

  const handleChange = (field) => (event) => {
    onChange({ ...formData, [field]: event.target.value });
  };

  const fields = [
    { name: 'name', label: 'Name', type: 'text' },
    { name: 'usn', label: 'USN', type: 'text' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'phone', label: 'Phone', type: 'text' },
    { name: 'branch', label: 'Branch', type: 'select', options: BRANCH_OPTIONS },
    { name: 'semester', label: 'Semester', type: 'number', min: 1, max: 8 },
    { name: 'cgpa', label: 'CGPA', type: 'number', min: 0, max: 10, step: 0.1 },
    { name: 'age', label: 'Age', type: 'number', min: 16, max: 60 },
    { name: 'gender', label: 'Gender', type: 'select', options: GENDER_OPTIONS },
    { name: 'address', label: 'Address', type: 'textarea' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-xl">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            {mode === 'create' ? 'Add Student' : 'Edit Student'}
          </h2>
        </div>
        <form onSubmit={onSubmit} className="space-y-4 px-6 py-5">
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map((field) => (
              <div key={field.name} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
                  {field.label}
                </label>
                {field.type === 'select' ? (
                  <select
                    value={formData[field.name]}
                    onChange={handleChange(field.name)}
                    required
                    className={INPUT_CLASS}
                  >
                    <option value="">Select {field.label}</option>
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea
                    value={formData[field.name]}
                    onChange={handleChange(field.name)}
                    required
                    rows={3}
                    className={INPUT_CLASS}
                  />
                ) : (
                  <input
                    type={field.type}
                    value={formData[field.name]}
                    onChange={handleChange(field.name)}
                    required
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    className={INPUT_CLASS}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : mode === 'create' ? 'Create Student' : 'Update Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudentForm;
