import React from 'react';
import { Truck, CheckCircle2, ChevronRight, Shield } from 'lucide-react';
import { usePulseRoute } from '../../context/PulseRouteContext';
import { VoiceTriagePanel } from './VoiceTriagePanel';
import { HospitalRankerCard } from './HospitalRankerCard';
import { EnRouteStreamer } from './EnRouteStreamer';

export const AmbulanceHUD = () => {
  const {
    activeAmbulanceId,
    paramedicStep,
    setParamedicStep,
    isDispatched,
  } = usePulseRoute();

  const steps = [
    { number: 1, title: "1. Assessment" },
    { number: 2, title: "2. Hospital & Bed" },
    { number: 3, title: "3. En Route HUD" },
  ];

  return (
    <div className="flex flex-col h-full gap-4 overflow-hidden">
      {/* Sub-header / Stepper Control Bar */}
      <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 flex items-center justify-between shadow-xs flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-slate-900 leading-none">
                Ambulance {activeAmbulanceId}
              </span>
              <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                Active EMS
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              Zone 3 Advanced Life Support
            </span>
          </div>
        </div>

        {/* 3-Step Wizard Navigation Pills */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200/80">
          {steps.map((st) => {
            const isActive = paramedicStep === st.number;
            const isCompleted = paramedicStep > st.number || (st.number === 2 && isDispatched);

            return (
              <button
                key={st.number}
                onClick={() => setParamedicStep(st.number)}
                className={`h-7 px-2.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isActive
                    ? "bg-white text-blue-700 shadow-2xs font-bold"
                    : isCompleted
                    ? "text-emerald-700 hover:text-emerald-800"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : null}
                <span>{st.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrollable Step Workspace */}
      <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4">
        {paramedicStep === 1 && <VoiceTriagePanel />}
        {paramedicStep === 2 && <HospitalRankerCard />}
        {paramedicStep === 3 && <EnRouteStreamer />}
      </div>
    </div>
  );
};
