import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({
  label,
  error,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-3 rounded-lg border border-[var(--border-color)] bg-white text-[var(--text-primary)] outline-none transition duration-150 focus:border-[var(--primary-color)] focus:ring-4 focus:ring-[var(--primary-light)] ${
          error ? 'border-red-500 focus:border-red-500 focus:ring-red-50' : ''
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
}
