import * as React from 'react';
import clsx from 'clsx';

type Variant = 'default' | 'success' | 'warning' | 'danger' | 'outline';

const variants: Record<Variant, string> = {
  default: 'badge-primary',
  success: 'badge-success',
  warning: 'badge-warning',
  danger: 'badge-danger',
  outline: 'badge-outline',
};

export function Badge({
  className,
  children,
  variant = 'default' as Variant,
}: {
  className?: string;
  children: React.ReactNode;
  variant?: Variant;
}) {
  return (
    <span className={clsx('badge', variants[variant], className)}>
      {children}
    </span>
  );
}

export default Badge;
