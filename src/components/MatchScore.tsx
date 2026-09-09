import React from 'react';

interface MatchScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const MatchScore: React.FC<MatchScoreProps> = ({
  score,
  size = 'md',
  showLabel = true,
}) => {
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));

  // Determine stroke color
  let strokeColor = '#10b981'; // emerald
  let textColor = 'text-emerald-700';
  let bgColor = 'bg-emerald-50';

  if (clampedScore < 75) {
    strokeColor = '#f59e0b'; // amber
    textColor = 'text-amber-700';
    bgColor = 'bg-amber-50';
  } else if (clampedScore < 88) {
    strokeColor = '#3b82f6'; // blue
    textColor = 'text-blue-700';
    bgColor = 'bg-blue-50';
  }

  const dimensions = {
    sm: { diameter: 44, strokeWidth: 4, text: 'text-xs font-bold' },
    md: { diameter: 60, strokeWidth: 5, text: 'text-sm font-bold' },
    lg: { diameter: 84, strokeWidth: 6, text: 'text-xl font-bold' },
  }[size];

  const radius = (dimensions.diameter - dimensions.strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative inline-flex items-center justify-center">
        <svg
          width={dimensions.diameter}
          height={dimensions.diameter}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={dimensions.diameter / 2}
            cy={dimensions.diameter / 2}
            r={radius}
            stroke="#e2e8f0"
            strokeWidth={dimensions.strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={dimensions.diameter / 2}
            cy={dimensions.diameter / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={dimensions.strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`${dimensions.text} ${textColor}`}>
            {clampedScore}%
          </span>
        </div>
      </div>
      {showLabel && (
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-1">
          Match
        </span>
      )}
    </div>
  );
};
