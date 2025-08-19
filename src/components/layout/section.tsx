import * as React from 'react';
import clsx from 'clsx';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
}

const spacing = {
  sm: 'section-sm',
  md: 'section',
  lg: 'section-lg',
  xl: 'section-xl',
};

export function Section({
  className,
  spacing: spacingProp = 'md',
  ...props
}: SectionProps) {
  return (
    <section className={clsx(spacing[spacingProp], className)} {...props} />
  );
}

export default Section;
