import { cn } from '../utils/cn';

/**
 * Upvote UI Tab List
 */
export function TabList({ className, children, ...props }) {
  return (
    <div
      role="tablist"
      className={cn(
        'flex items-center gap-1 border-b border-upvote-border',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Upvote UI Tab
 */
export function Tab({ active = false, className, children, onClick, ...props }) {
  return (
    <button
      role="tab"
      type="button"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        'relative px-4 py-2.5 font-[family-name:var(--font-upvote-sans)] text-sm',
        'transition-colors duration-[var(--duration-upvote-fast)]',
        'focus-visible:outline-2 focus-visible:outline-upvote-focus focus-visible:outline-offset-[-2px]',
        active
          ? 'text-upvote-text-strong font-semibold'
          : 'text-upvote-text font-normal hover:text-upvote-text-strong',
        className
      )}
      {...props}
    >
      {children}
      {active && (
        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-upvote-text-strong rounded-t-sm" />
      )}
    </button>
  );
}

/**
 * Upvote UI Tab Panel
 */
export function TabPanel({ className, children, hidden, ...props }) {
  return (
    <div
      role="tabpanel"
      hidden={hidden}
      className={cn('py-4', className)}
      {...props}
    >
      {children}
    </div>
  );
}
