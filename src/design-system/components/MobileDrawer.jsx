import { useEffect } from 'react';
import { cn } from '../utils/cn';
import { Button } from './Button';

/**
 * Upvote UI Mobile Drawer — slide-in navigation for small screens
 */
export function MobileDrawer({
  open,
  onClose,
  title,
  header,
  footer,
  children,
  className,
  ...props
}) {
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden" {...props}>
      <div
        className="absolute inset-0 bg-upvote-scrim"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={cn(
          'absolute top-0 left-0 bottom-0 w-[min(20rem,85vw)]',
          'bg-upvote-surface flex flex-col',
          'shadow-upvote-md',
          'animate-[slideIn_200ms_var(--ease-upvote-enter)_forwards]',
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-label={title ?? 'Navigation menu'}
      >
        <div className="flex items-center justify-between p-4 border-b border-upvote-border">
          {header ?? (
            <span className="upvote-h3">{title ?? 'Menu'}</span>
          )}
          <Button variant="icon" size="icon-sm" onClick={onClose} aria-label="Close menu">
            <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
              <path d="M4.5 4.5l11 11M15.5 4.5l-11 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 flex flex-col gap-1">
          {children}
        </nav>

        {footer && (
          <div className="p-4 border-t border-upvote-border">
            {footer}
          </div>
        )}
      </aside>
    </div>
  );
}

export function MobileDrawerLink({ icon, label, onClick, active = false, className, ...props }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 w-full px-3 py-2.5 rounded-upvote-md',
        'font-[family-name:var(--font-upvote-sans)] text-sm font-medium text-left',
        'transition-colors duration-[var(--duration-upvote-fast)]',
        active
          ? 'bg-upvote-surface-hover text-upvote-text-strong font-semibold'
          : 'text-upvote-text hover:bg-upvote-surface-hover',
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {label}
    </button>
  );
}
