import { cn } from '../utils/cn';

const variants = {
  default: 'bg-upvote-surface-secondary text-upvote-text',
  outline: 'bg-transparent border border-upvote-border-light text-upvote-text',
  brand: 'bg-upvote-brand/10 text-upvote-brand',
  nsfw: 'bg-upvote-nsfw-bg text-upvote-nsfw',
  spoiler: 'bg-upvote-spoiler-bg text-upvote-text-strong',
  success: 'bg-upvote-success/10 text-upvote-success',
  tag: 'bg-upvote-surface-secondary text-upvote-text-weak',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2 py-0.5 text-xs',
};

/**
 * Upvote UI Pill — flair badges and tags
 */
export function Pill({ variant = 'default', size = 'md', className, children, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-[family-name:var(--font-upvote-sans)] font-semibold',
        'rounded-upvote-full whitespace-nowrap',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

/**
 * Community badge — subreddit identifier pill
 */
export function CommunityBadge({ name, icon, className, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-[family-name:var(--font-upvote-sans)]',
        'text-xs font-semibold text-upvote-link hover:text-upvote-link-hover',
        'transition-colors duration-[var(--duration-upvote-fast)]',
        className
      )}
      {...props}
    >
      {icon && (
        <span className="w-5 h-5 rounded-full bg-upvote-surface-secondary overflow-hidden shrink-0">
          {icon}
        </span>
      )}
      r/{name}
    </span>
  );
}

/**
 * Tag — hashtag-style label
 */
export function Tag({ label, className, ...props }) {
  return (
    <Pill variant="tag" className={cn('hover:bg-upvote-surface-hover cursor-default', className)} {...props}>
      #{label}
    </Pill>
  );
}
