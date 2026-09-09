import React from 'react';

interface SkillBadgeProps {
  skill: string;
  isMatched?: boolean;
  isMissing?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onRemove?: () => void;
  className?: string;
}

export const SkillBadge: React.FC<SkillBadgeProps> = ({
  skill,
  isMatched = false,
  isMissing = false,
  size = 'md',
  onRemove,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  }[size];

  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';

  if (isMatched) {
    colorClasses = 'bg-emerald-50 text-emerald-800 border-emerald-300 font-medium';
  } else if (isMissing) {
    colorClasses = 'bg-amber-50 text-amber-800 border-amber-300 font-medium';
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border ${sizeClasses} ${colorClasses} transition-all duration-150 whitespace-nowrap select-none ${className}`}
    >
      {isMatched && (
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      )}
      <span>{skill}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1 hover:text-red-500 rounded-full p-0.5 focus:outline-none"
          aria-label={`Remove ${skill}`}
        >
          ×
        </button>
      )}
    </span>
  );
};
