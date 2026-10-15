import React from 'react';

export const VitalBox = ({ label, value, unit, status = 'normal', subtext, color = 'green' }) => {
  const accentStyles = {
    green: {
      num: "text-slate-900",
      pill: "bg-emerald-50 text-emerald-700 border-emerald-100",
      bar: "bg-emerald-500",
    },
    cyan: {
      num: "text-slate-900",
      pill: "bg-sky-50 text-sky-700 border-sky-100",
      bar: "bg-sky-500",
    },
    amber: {
      num: "text-amber-900",
      pill: "bg-amber-50 text-amber-700 border-amber-100",
      bar: "bg-amber-500",
    },
    red: {
      num: "text-red-900",
      pill: "bg-red-50 text-red-700 border-red-100",
      bar: "bg-red-500",
    },
    blue: {
      num: "text-slate-900",
      pill: "bg-blue-50 text-blue-700 border-blue-100",
      bar: "bg-blue-500",
    }
  };

  const currentTheme = accentStyles[color] || accentStyles.green;

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all">
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
        <span>{label}</span>
        {subtext && (
          <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold border ${currentTheme.pill}`}>
            {subtext}
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-1.5 my-1">
        <span className={`text-2xl font-bold tracking-tight metric-num ${currentTheme.num}`}>
          {value}
        </span>
        <span className="text-xs text-slate-400 font-medium">{unit}</span>
      </div>
    </div>
  );
};
