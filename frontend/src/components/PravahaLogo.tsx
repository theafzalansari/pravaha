interface PravahaLogoProps {
  size?: number;
  className?: string;
}

export function PravahaLogo({ size = 24, className = "" }: PravahaLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer subtle geometric accent ring */}
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeOpacity="0.4"
        strokeDasharray="2 1.5"
      />

      {/* Primary Flowing 'P' line motif */}
      <path
        d="M7.5 18V6C7.5 6 11 5 14.5 7C17.5 8.75 16.5 12.5 13 13C9.5 13.5 7.5 12.5 7.5 12.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Secondary flowing river wave base */}
      <path
        d="M5 18C7.2 18 9 16.8 11.5 16.8C14 16.8 15.8 18 18 18"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
