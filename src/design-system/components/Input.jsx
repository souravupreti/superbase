import { forwardRef } from 'react';
import { cn } from '../utils/cn';

const baseInputClasses = [
  'w-full font-[family-name:var(--font-upvote-sans)] text-sm text-upvote-text-strong',
  'bg-upvote-surface-input border border-transparent rounded-upvote-md',
  'px-3 h-10',
  'placeholder:text-upvote-text-weak',
  'transition-[border-color,box-shadow] duration-[var(--duration-upvote-fast)]',
  'focus:outline-none focus:border-upvote-focus',
  'disabled:cursor-not-allowed disabled:opacity-60',
];

/**
 * Upvote UI Text Input
 */
export const Input = forwardRef(function Input(
  { className, error, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      className={cn(
        baseInputClasses,
        error && 'border-upvote-danger focus:border-upvote-danger',
        className
      )}
      {...props}
    />
  );
});

/**
 * Upvote UI Password Input
 */
export const PasswordInput = forwardRef(function PasswordInput(
  { className, error, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      type="password"
      className={cn(
        baseInputClasses,
        error && 'border-upvote-danger focus:border-upvote-danger',
        className
      )}
      {...props}
    />
  );
});

/**
 * Upvote UI Textarea
 */
export const Textarea = forwardRef(function Textarea(
  { className, error, rows = 4, ...props },
  ref
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(
        'w-full font-[family-name:var(--font-upvote-sans)] text-sm text-upvote-text-strong',
        'bg-upvote-surface-input border border-transparent rounded-upvote-md',
        'px-3 py-2 min-h-[5rem] resize-y',
        'placeholder:text-upvote-text-weak',
        'transition-[border-color] duration-[var(--duration-upvote-fast)]',
        'focus:outline-none focus:border-upvote-focus',
        'disabled:cursor-not-allowed disabled:opacity-60',
        error && 'border-upvote-danger focus:border-upvote-danger',
        className
      )}
      {...props}
    />
  );
});

/**
 * Upvote UI Search Input — pill-shaped with icon slot
 */
export const SearchInput = forwardRef(function SearchInput(
  { className, icon, error, ...props },
  ref
) {
  return (
    <div className="relative w-full">
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-upvote-text-weak pointer-events-none">
          {icon}
        </span>
      )}
      <input
        ref={ref}
        type="search"
        className={cn(
          'w-full font-[family-name:var(--font-upvote-sans)] text-sm text-[#131313]',
          'bg-upvote-surface-search border border-transparent rounded-upvote-pill',
          'h-10',
          icon ? 'pl-9 pr-3' : 'px-3',
          'placeholder:text-upvote-text-weak',
          'transition-[border-color] duration-[var(--duration-upvote-fast)]',
          'focus:outline-none focus:border-upvote-focus',
          error && 'border-upvote-danger',
          className
        )}
        {...props}
      />
    </div>
  );
});

export function InputLabel({ className, children, htmlFor, required, ...props }) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn('upvote-label block mb-1.5', className)}
      {...props}
    >
      {children}
      {required && <span className="text-upvote-danger ml-0.5">*</span>}
    </label>
  );
}

export function InputError({ className, children, ...props }) {
  if (!children) return null;
  return (
    <p className={cn('upvote-caption text-upvote-danger mt-1', className)} {...props}>
      {children}
    </p>
  );
}

export function InputGroup({ className, children, ...props }) {
  return (
    <div className={cn('flex flex-col gap-1', className)} {...props}>
      {children}
    </div>
  );
}
