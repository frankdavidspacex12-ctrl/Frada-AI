import React from 'react';

interface GelatinIconProps {
  className?: string;
  color?: string;
}

export const GelatinSilhouette: React.FC<GelatinIconProps> = ({
  className = 'w-10 h-10',
  color = '#FFFFFF',
}) => {
  return (
    <svg
      viewBox="0 0 100 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Silueta de gelatina artesanal"
    >
      {/* Molded bundt artisanal gelatin shape */}
      {/* Top curved crown */}
      <path
        d="M 32 20 C 32 12, 68 12, 68 20 C 72 21, 78 28, 82 45 C 86 60, 84 68, 80 70 C 75 72, 25 72, 20 70 C 16 68, 14 60, 18 45 C 22 28, 28 21, 32 20 Z"
        fill={color}
      />
      {/* Fluted mold scalloped indentations */}
      <path
        d="M 34 22 C 34 38, 30 58, 28 69"
        stroke="#4A2E18"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeOpacity="0.25"
      />
      <path
        d="M 44 20 C 44 38, 42 58, 41 70"
        stroke="#4A2E18"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeOpacity="0.25"
      />
      <path
        d="M 56 20 C 56 38, 58 58, 59 70"
        stroke="#4A2E18"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeOpacity="0.25"
      />
      <path
        d="M 66 22 C 66 38, 70 58, 72 69"
        stroke="#4A2E18"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeOpacity="0.25"
      />
      {/* Top center bundt hollow/scallop */}
      <ellipse
        cx="50"
        cy="19"
        rx="15"
        ry="5"
        fill={color}
      />
      {/* Glossy gelatin highlight */}
      <path
        d="M 36 28 C 39 30, 40 38, 39 46"
        stroke="#FFFFFF"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeOpacity="0.8"
      />
      {/* Cute little berry or heart garnish atop */}
      <circle cx="50" cy="12" r="3.5" fill={color} />
    </svg>
  );
};
