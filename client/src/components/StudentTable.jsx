function StudentTable({ students, onEdit, onDelete }) {
  if (students.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
        <p className="text-sm font-medium text-slate-700">No students found</p>
        <p className="mt-1 text-sm text-slate-500">Try adjusting filters or add a new student.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              {['Name', 'USN', 'Email', 'Branch', 'Sem', 'CGPA', 'Actions'].map((heading) => (
                <th
                  key={heading}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map((student) => (
              <tr key={student._id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">{student.name}</td>
                <td className="px-4 py-3 text-slate-700">{student.usn}</td>
                <td className="px-4 py-3 text-slate-700">{student.email}</td>
                <td className="px-4 py-3 text-slate-700">{student.branch}</td>
                <td className="px-4 py-3 text-slate-700">{student.semester}</td>
                <td className="px-4 py-3 text-slate-700">{student.cgpa}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(student)}
                      className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(student)}
                      className="rounded-md border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentTable;
