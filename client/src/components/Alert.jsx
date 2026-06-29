import { cn } from '../utils/cn';

const VARIANTS = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  error: 'border-red-200 bg-red-50 text-red-800',
  info: 'border-slate-200 bg-slate-50 text-slate-700',
};

function Alert({ variant = 'info', message, errors = [], onClose }) {
  if (!message && errors.length === 0) {
    return null;
  }

  return (
    <div className={cn('rounded-lg border px-4 py-3 text-sm', VARIANTS[variant])}>
      <div className="flex items-start justify-between gap-3">
        <div>
          {message && <p className="font-medium">{message}</p>}
          {errors.length > 0 && (
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          )}
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-current opacity-70 transition hover:opacity-100"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

export default Alert;
