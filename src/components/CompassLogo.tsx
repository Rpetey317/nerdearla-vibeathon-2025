'use client';

interface CompassLogoProps {
  size?: number;
  className?: string;
}

export default function CompassLogo({ size = 32, className = "" }: CompassLogoProps) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm"
      >
        {/* Outer ring - dark border */}
        <circle
          cx="16"
          cy="16"
          r="15"
          fill="#374151"
          stroke="#1f2937"
          strokeWidth="1"
        />
        
        {/* Inner compass face */}
        <circle
          cx="16"
          cy="16"
          r="13"
          fill="#f3f4f6"
          stroke="#d1d5db"
          strokeWidth="0.5"
        />
        
        {/* Cardinal direction markers */}
        <g stroke="#6b7280" strokeWidth="1" fill="#6b7280">
          {/* North */}
          <line x1="16" y1="4" x2="16" y2="7" />
          <text x="16" y="12" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#374151">N</text>
          
          {/* East */}
          <line x1="28" y1="16" x2="25" y2="16" />
          <text x="22" y="18" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#374151">E</text>
          
          {/* South */}
          <line x1="16" y1="28" x2="16" y2="25" />
          <text x="16" y="24" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#374151">S</text>
          
          {/* West */}
          <line x1="4" y1="16" x2="7" y2="16" />
          <text x="10" y="18" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#374151">W</text>
        </g>
        
        {/* Compass needle */}
        <g transform="rotate(45 16 16)">
          {/* North pointer (red) */}
          <polygon
            points="16,8 18,14 16,13 14,14"
            fill="#dc2626"
            stroke="#991b1b"
            strokeWidth="0.5"
          />
          
          {/* South pointer (white/gray) */}
          <polygon
            points="16,24 18,18 16,19 14,18"
            fill="#f9fafb"
            stroke="#6b7280"
            strokeWidth="0.5"
          />
        </g>
        
        {/* Center pivot */}
        <circle
          cx="16"
          cy="16"
          r="2"
          fill="#374151"
          stroke="#1f2937"
          strokeWidth="0.5"
        />
        <circle
          cx="16"
          cy="16"
          r="1"
          fill="#f3f4f6"
        />
      </svg>
    </div>
  );
}
