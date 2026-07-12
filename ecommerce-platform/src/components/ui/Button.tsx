import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyle = 'inline-flex items-center justify-center font-semibold rounded-lg transition duration-200 ease-in-out focus:outline-none cursor-pointer';
  
  const variants = {
    primary: 'bg-[var(--primary-color)] text-white hover:bg-[var(--primary-hover)] shadow-sm hover:translate-y-[-1px]',
    secondary: 'bg-white text-[var(--text-primary)] border border-[var(--border-color)] hover:bg-gray-50',
    outline: 'bg-transparent text-[var(--primary-color)] border border-[var(--primary-color)] hover:bg-[var(--primary-light)]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3 text-base',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
