import Image from 'next/image';

type LogoProps = {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
};

export default function Logo({ size = 'md', className }: LogoProps) {
  const sizes = {
    sm: 32,
    md: 120,
    lg: 64,
    xl: 96, // ekstra büyük
  };

  return (
    <Image
      src="/logo.png"
      alt="Remax Wise Logo"
      width={sizes[size]}
      height={sizes[size]}
      className={className}
      priority
    />
  );
}
