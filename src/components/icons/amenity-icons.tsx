import React from 'react';

type IconProps = { className?: string };

export const CheckIcon = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M5 12l5 5 9-10" />
  </svg>
);

export const BalconyIcon = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="5" y="3" width="14" height="8" rx="1" />
    <line x1="6" y1="15" x2="6" y2="21" />
    <line x1="9" y1="15" x2="9" y2="21" />
    <line x1="12" y1="15" x2="12" y2="21" />
    <line x1="15" y1="15" x2="15" y2="21" />
    <line x1="18" y1="15" x2="18" y2="21" />
    <line x1="5" y1="15" x2="19" y2="15" />
  </svg>
);

export const GarageIcon = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="3" y="7" width="18" height="14" rx="1" />
    <rect x="6" y="13" width="12" height="6" />
    <line x1="6" y1="15" x2="18" y2="15" />
    <line x1="6" y1="17" x2="18" y2="17" />
  </svg>
);

export const ElevatorIcon = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="5" y="3" width="14" height="18" rx="1" />
    <path d="M12 8l-2 2h4l-2-2z" />
    <path d="M12 16l2-2H10l2 2z" />
  </svg>
);

export const ACIcon = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="12" y1="3" x2="12" y2="21" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="5" y1="5" x2="9" y2="9" />
    <line x1="15" y1="15" x2="19" y2="19" />
    <line x1="5" y1="19" x2="9" y2="15" />
    <line x1="15" y1="9" x2="19" y2="5" />
  </svg>
);

export const BedIcon = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="3" y="10" width="18" height="7" rx="1" />
    <rect x="5" y="7" width="6" height="3" />
  </svg>
);

export const BathIcon = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M4 13h16v2a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-2z" />
    <path d="M7 13V7a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v6" />
    <path d="M17 7h-3" />
  </svg>
);

export const AreaIcon = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="4" y="4" width="16" height="16" rx="1" />
    <path d="M9 4v4H5" />
    <path d="M15 20v-4h4" />
  </svg>
);

export const EnergyIcon = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M13 2L3 14h7l-1 8 12-14h-8l1-6z" />
  </svg>
);

/** Map amenity name → icon component (fallback: CheckIcon) */
export function iconForAmenity(name: string) {
  const n = (name || '').toLowerCase();
  if (n.includes('balcony')) return BalconyIcon;
  if (n.includes('garage')) return GarageIcon;
  if (n.includes('elevator') || n.includes('lift')) return ElevatorIcon;
  if (n.includes('air') || n.includes('a/c') || n.includes('condition'))
    return ACIcon;
  return CheckIcon;
}

/** For "Facts" badges */
export const factIcons = {
  type: BedIcon,
  bedrooms: BedIcon,
  bathrooms: BathIcon,
  area: AreaIcon,
  energy: EnergyIcon,
};
