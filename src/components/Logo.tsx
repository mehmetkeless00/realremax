interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ className = '', size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-6 w-20',
    md: 'h-8 w-24',
    lg: 'h-12 w-32',
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg
        viewBox="0 0 120 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* R */}
        <path
          d="M10 8h8c2.2 0 4 1.8 4 4s-1.8 4-4 4h-4l6 8h-3l-5-7h-2v7h-3V8z"
          fill="#ff1200"
        />
        <path d="M18 14c.6 0 1-.4 1-1s-.4-1-1-1h-5v2h5z" fill="#ff1200" />

        {/* E */}
        <path d="M30 8h3v2h-1v6h1v2h-3v-2h1v-6h-1V8z" fill="#ff1200" />

        {/* M */}
        <path
          d="M40 8h3l2 6 2-6h3v12h-3v-6l-2 6h-2l-2-6v6h-3V8z"
          fill="#ff1200"
        />

        {/* A */}
        <path
          d="M55 8h3l3 12h-3l-1-4h-3l-1 4h-3L55 8zm1 2l-1.5 6h3L56 10z"
          fill="#ff1200"
        />

        {/* X */}
        <path
          d="M65 8h3l2 5 2-5h3l-3 6 3 6h-3l-2-5-2 5h-3l3-6-3-6z"
          fill="#ff1200"
        />

        {/* Unified Platform text */}
        <text
          x="10"
          y="32"
          fontSize="8"
          fill="#232323"
          fontFamily="Montserrat, sans-serif"
          fontWeight="500"
        >
          Unified Platform
        </text>
      </svg>
    </div>
  );
}
