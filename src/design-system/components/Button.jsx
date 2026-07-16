import { forwardRef } from 'react';
import { cn } from '../utils/cn';

const variants = {
  primary:
    'bg-upvote-primary text-upvote-text-inverse hover:bg-upvote-primary-hover active:bg-upvote-brand-hover disabled:bg-upvote-primary-disabled',
  secondary:
    'bg-upvote-surface-secondary text-upvote-text-strong hover:bg-[#dbe4e9] active:bg-upvote-surface-secondary',
  ghost:
    'bg-transparent text-upvote-text-strong border border-upvote-border-ghost hover:bg-upvote-surface-hover active:bg-upvote-surface-hover',
  destructive:
    'bg-upvote-danger text-upvote-text-inverse hover:bg-[#9a0113] active:bg-upvote-danger',
  icon:
    'bg-transparent text-upvote-text-strong hover:bg-upvote-surface-hover active:bg-upvote-surface-secondary p-0',
};

const sizes = {
  md: 'h-10 px-3 text-sm font-semibold rounded-upvote-pill',
  sm: 'h-8 px-[9px] text-xs font-semibold rounded-upvote-pill',
  ghost: 'h-[38px] px-[11px] text-sm font-semibold rounded-upvote-pill',
  icon: 'h-10 w-10 rounded-upvote-pill inline-flex items-center justify-center',
  'icon-sm': 'h-8 w-8 rounded-upvote-pill inline-flex items-center justify-center',
};

/**
 * Upvote UI Button
 * Variants: primary | secondary | ghost | destructive | icon
 */
export const Button = forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    className,
    children,
    leftIcon,
    rightIcon,
    ...props
  },
  ref
) {
  const resolvedSize = variant === 'ghost' ? 'ghost' : variant === 'icon' ? (size === 'sm' ? 'icon-sm' : 'icon') : size;

  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-[family-name:var(--font-upvote-sans)]',
        'transition-colors duration-[var(--duration-upvote-fast)] ease-[var(--ease-upvote-standard)]',
        'focus-visible:outline-2 focus-visible:outline-upvote-focus focus-visible:outline-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-100',
        variants[variant],
        sizes[resolvedSize],
        className
      )}
      {...props}
    >
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
});
