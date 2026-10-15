import React from 'react';
import { CheckSquare, Square, ClipboardCheck } from 'lucide-react';
import { usePulseRoute } from '../../context/PulseRouteContext';

export const PreArrivalChecklist = () => {
  const {
    checkedItems,
    toggleChecklist,
    patientCard,
  } = usePulseRoute();

  const standardChecklist = [
    "Alert 24/7 Primary PCI Cath-Lab Team (Page Interventionalist)",
    "Prep CCU Bed #4 with continuous monitor",
    "Ready IV Heparin & Defibrillator pads at Bay 4",
    "Notify ER Triage Physician of Inbound STEMI",
  ];

  const items = patientCard.checklist && patientCard.checklist.length > 0
    ? patientCard.checklist
    : standardChecklist;

  const total = items.length;
  const completed = Object.values(checkedItems).filter(Boolean).length;
  const isComplete = total > 0 && completed === total;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col">
      {/* Standardized Card Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <div className="flex items-center gap-2">
          <ClipboardCheck className="w-4 h-4 text-blue-600" />
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Pre-Arrival Clinical Preparation
            </h3>
            <span className="text-[11px] text-slate-500">
              {completed} of {total} protocols completed by trauma team
            </span>
          </div>
        </div>

        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
          isComplete
            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
            : "bg-amber-50 text-amber-700 border-amber-200"
        }`}>
          {isComplete ? "Team Ready at Bay" : "Prep in Progress"}
        </span>
      </div>

      {/* Checklist Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {items.map((item, idx) => {
          const isDone = !!checkedItems[idx];

          return (
            <div
              key={idx}
              onClick={() => toggleChecklist(idx)}
              className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between text-xs font-medium ${
                isDone
                  ? "bg-emerald-50/50 border-emerald-200 text-slate-900"
                  : "bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center gap-2">
                {isDone ? (
                  <CheckSquare className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400 flex-shrink-0" />
                )}
                <span className={isDone ? "line-through text-slate-400" : ""}>
                  {item}
                </span>
              </div>
              <span className={`text-[10px] font-semibold uppercase ${
                isDone ? "text-emerald-700" : "text-slate-400"
              }`}>
                {isDone ? "Ready" : "Pending"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
