import * as React from 'react';
import clsx from 'clsx';
import { Slot } from '@radix-ui/react-slot';

type Variant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'outlineOnPrimary';
type Size = 'sm' | 'md' | 'lg' | 'icon';

const base = 'btn';

const sizes: Record<Size, string> = {
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
  icon: 'h-10 w-10',
};

const variants: Record<Variant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
  outlineOnPrimary: 'btn-outline-on-primary',
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      className={clsx(base, sizes[size], variants[variant], className)}
      {...props}
    />
  );
}
export default Button;
