import { cn } from '../utils/cn';
import { SnooIcon } from './Icon';

/**
 * Upvote UI Topbar — sticky header with logo, search slot, and actions
 */
export function Topbar({
  className,
  logo,
  search,
  actions,
  leftSlot,
  ...props
}) {
  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full h-14',
        'bg-upvote-surface border-b border-upvote-border',
        'shadow-upvote-nav',
        className
      )}
      {...props}
    >
      <div className="upvote-container h-full flex items-center gap-4">
        {leftSlot}
        <div className="flex items-center gap-2 shrink-0">
          {logo ?? (
            <div className="flex items-center gap-1.5">
              <SnooIcon className="w-7 h-7" />
              <span className="upvote-h3 text-upvote-brand hidden sm:inline">upvote</span>
            </div>
          )}
        </div>

        {search && (
          <div className="flex-1 max-w-xl mx-auto hidden sm:block">
            {search}
          </div>
        )}

        <div className="flex items-center gap-2 ml-auto shrink-0">
          {actions}
        </div>
      </div>
    </header>
  );
}

export function TopbarAction({ className, children, ...props }) {
  return (
    <div className={cn('flex items-center gap-2', className)} {...props}>
      {children}
    </div>
  );
}
