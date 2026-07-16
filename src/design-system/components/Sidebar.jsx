import { NavLink } from 'react-router-dom';
import { cn } from '../utils/cn';

/**
 * Upvote UI Sidebar — left navigation rail
 */
export function Sidebar({ className, header, footer, children, ...props }) {
  return (
    <aside
      className={cn(
        'hidden md:flex flex-col w-64 shrink-0',
        'bg-upvote-surface border-r border-upvote-border',
        'h-[calc(100vh-var(--height-upvote-topbar))] sticky top-14',
        className
      )}
      {...props}
    >
      {header && (
        <div className="p-4 border-b border-upvote-border">
          {header}
        </div>
      )}

      <nav className="flex-1 overflow-y-auto p-3 flex flex-col gap-1">
        {children}
      </nav>

      {footer && (
        <div className="p-4 border-t border-upvote-border">
          {footer}
        </div>
      )}
    </aside>
  );
}

/**
 * Sidebar navigation link
 */
export function SidebarLink({
  to,
  icon,
  label,
  badge,
  end = false,
  className,
  onClick,
  ...props
}) {
  const linkClass = ({ isActive }) =>
    cn(
      'flex items-center gap-3 px-3 py-2 rounded-upvote-md',
      'font-[family-name:var(--font-upvote-sans)] text-sm font-medium',
      'transition-colors duration-[var(--duration-upvote-fast)]',
      isActive
        ? 'bg-upvote-surface-hover text-upvote-text-strong font-semibold'
        : 'text-upvote-text hover:bg-upvote-surface-hover hover:text-upvote-text-strong',
      className
    );

  const content = (
    <>
      {icon && <span className="shrink-0 text-upvote-text-weak">{icon}</span>}
      <span className="flex-1 truncate">{label}</span>
      {badge != null && badge > 0 && (
        <span className="min-w-5 h-5 px-1.5 flex items-center justify-center rounded-upvote-full bg-upvote-primary text-upvote-text-inverse text-xs font-semibold">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </>
  );

  if (to) {
    return (
      <NavLink to={to} end={end} className={linkClass} onClick={onClick} {...props}>
        {content}
      </NavLink>
    );
  }

  return (
    <button type="button" className={linkClass({ isActive: false })} onClick={onClick} {...props}>
      {content}
    </button>
  );
}

export function SidebarSection({ title, className, children, ...props }) {
  return (
    <div className={cn('mt-4 first:mt-0', className)} {...props}>
      {title && (
        <p className="upvote-caption font-semibold uppercase tracking-wide px-3 mb-1.5">
          {title}
        </p>
      )}
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  );
}
