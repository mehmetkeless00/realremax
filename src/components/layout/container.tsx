import * as React from 'react';
import clsx from 'clsx';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const sizes = {
  sm: 'max-w-3xl',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-none',
};

export function Container({
  className,
  size = 'lg',
  ...props
}: ContainerProps) {
  return (
    <div
      className={clsx('container-page', sizes[size], className)}
      {...props}
    />
  );
}

export default Container;
