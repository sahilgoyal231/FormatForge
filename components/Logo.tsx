import React from 'react';

export function Logo({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 200 200" 
      className={className}
      fill="none"
    >
      <defs>
        <linearGradient id="forgeGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#67e8f9" /> {/* cyan-300 */}
          <stop offset="100%" stopColor="#06b6d4" /> {/* cyan-500 */}
        </linearGradient>
        <linearGradient id="forgeGradient2" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0891b2" /> {/* cyan-600 */}
          <stop offset="100%" stopColor="#0e7490" /> {/* cyan-700 */}
        </linearGradient>
        <linearGradient id="forgeGradient3" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" /> {/* cyan-400 */}
          <stop offset="100%" stopColor="#164e63" /> {/* cyan-900 */}
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="12" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Background glow */}
      <circle cx="100" cy="100" r="50" fill="#22d3ee" opacity="0.15" filter="url(#glow)" />
      
      {/* Main geometric shapes forming an abstract F and Play button */}
      <path 
        d="M 50 40 L 150 40 L 120 70 L 80 70 L 80 160 L 50 160 Z" 
        fill="url(#forgeGradient1)" 
        style={{ filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.3))" }}
      />
      <path 
        d="M 80 90 L 140 90 L 110 120 L 80 120 Z" 
        fill="url(#forgeGradient2)" 
        style={{ filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.3))" }}
      />
      
      {/* Play button overlay that intersects the F */}
      <path 
        d="M 110 60 L 170 100 L 110 140 Z" 
        fill="url(#forgeGradient3)" 
        opacity="0.95" 
        style={{ filter: "drop-shadow(0px 4px 10px rgba(6,182,212,0.4))" }}
      />
    </svg>
  );
}
