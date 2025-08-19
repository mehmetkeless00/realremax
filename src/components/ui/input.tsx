import * as React from 'react';
import clsx from 'clsx';

const base =
  'w-full h-10 rounded-md border border-border bg-bg text-fg px-3 placeholder:opacity-60 outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent';

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input ref={ref} className={clsx(base, className)} {...props} />
));

Input.displayName = 'Input';

export default Input;
