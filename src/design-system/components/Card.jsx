import { forwardRef } from 'react';
import { cn } from '../utils/cn';

const variants = {
  post: 'bg-upvote-surface border border-upvote-border rounded-upvote-lg shadow-upvote-sm',
  container: 'bg-upvote-surface-container rounded-upvote-md',
  elevated: 'bg-upvote-surface border border-upvote-border rounded-upvote-lg shadow-upvote-md',
  flat: 'bg-upvote-surface rounded-upvote-md',
};

const paddings = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

/**
 * Upvote UI Card
 * Variants: post | container | elevated | flat
 */
export const Card = forwardRef(function Card(
  { variant = 'post', padding = 'md', className, children, as: Component = 'div', ...props },
  ref
) {
  return (
    <Component
      ref={ref}
      className={cn(variants[variant], paddings[padding], className)}
      {...props}
    >
      {children}
    </Component>
  );
});

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn('flex items-center gap-2 mb-3', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, as: Component = 'h3', ...props }) {
  return (
    <Component className={cn('upvote-h3', className)} {...props}>
      {children}
    </Component>
  );
}

export function CardBody({ className, children, ...props }) {
  return (
    <div className={cn('upvote-body', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 mt-3 pt-3 border-t border-upvote-border',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
