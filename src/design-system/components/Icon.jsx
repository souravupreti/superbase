import { cn } from '../utils/cn';

const sizes = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
};

/**
 * Upvote UI Icon wrapper — consistent sizing for lucide or custom SVGs
 */
export function Icon({ children, size = 'md', className, label, ...props }) {
  return (
    <span
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={!label}
      className={cn('inline-flex items-center justify-center shrink-0', sizes[size], className)}
      {...props}
    >
      {children}
    </span>
  );
}

/** Reddit upvote arrow */
export function UpvoteIcon({ active = false, className, ...props }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className={cn(
        'w-5 h-5',
        active ? 'text-upvote-upvote' : 'text-upvote-text-weak',
        className
      )}
      aria-hidden="true"
      {...props}
    >
      <path d="M10 3.5L3.5 12h4.5v4.5h4V12h4.5L10 3.5z" />
    </svg>
  );
}

/** Reddit downvote arrow */
export function DownvoteIcon({ active = false, className, ...props }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className={cn(
        'w-5 h-5',
        active ? 'text-upvote-downvote' : 'text-upvote-text-weak',
        className
      )}
      aria-hidden="true"
      {...props}
    >
      <path d="M10 16.5L16.5 8H12V3.5H8V8H3.5L10 16.5z" />
    </svg>
  );
}

/** Snoo mascot simplified mark */
export function SnooIcon({ className, ...props }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className={cn('w-5 h-5 text-upvote-brand', className)}
      aria-hidden="true"
      {...props}
    >
      <circle cx="10" cy="11" r="6" />
      <circle cx="7" cy="10" r="1.2" fill="white" />
      <circle cx="13" cy="10" r="1.2" fill="white" />
      <path d="M10 3.5a1.5 1.5 0 0 1 0 3" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

export const iconSizes = sizes;
