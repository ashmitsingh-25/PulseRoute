import React from 'react';

export const StatusBadge = ({ label, variant = 'neutral', size = 'sm', pulse = false }) => {
  const variantStyles = {
    critical: "bg-red-50 text-red-700 border-red-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    info: "bg-blue-50 text-blue-700 border-blue-200",
    neutral: "bg-slate-100 text-slate-600 border-slate-200",
  };

  const dotColors = {
    critical: "bg-red-500",
    warning: "bg-amber-500",
    success: "bg-emerald-500",
    info: "bg-blue-500",
    neutral: "bg-slate-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium border rounded-full px-2.5 py-0.5 transition-colors ${
        size === 'xs' ? 'text-[11px]' : 'text-xs'
      } ${variantStyles[variant] || variantStyles.neutral}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]} ${pulse ? 'animate-ping' : ''}`} />
      <span>{label}</span>
    </span>
  );
};
