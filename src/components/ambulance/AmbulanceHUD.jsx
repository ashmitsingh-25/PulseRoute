import React from 'react';
import { Truck, CheckCircle2, ChevronRight, Wifi, Shield } from 'lucide-react';
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
    { number: 1, title: "Triage Assessment" },
    { number: 2, title: "Hospital & Bed Hold" },
    { number: 3, title: "En Route Transit" },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 overflow-y-auto">
      {/* Paramedic Header Bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 leading-none">
                Ambulance {activeAmbulanceId}
              </h2>
              <span className="text-[11px] font-medium bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                Active EMS Unit
              </span>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              Zone 3 Advanced Life Support • Paramedic Onboard
            </span>
          </div>
        </div>

        {/* 3-Step Wizard Navigation Pills */}
        <div className="hidden sm:flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          {steps.map((st) => {
            const isActive = paramedicStep === st.number;
            const isCompleted = paramedicStep > st.number || (st.number === 2 && isDispatched);

            return (
              <button
                key={st.number}
                onClick={() => setParamedicStep(st.number)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-white text-blue-700 shadow-xs"
                    : isCompleted
                    ? "text-emerald-700 hover:text-emerald-800"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <span className={`w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : isCompleted
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-300 text-slate-600"
                }`}>
                  {isCompleted ? "✓" : st.number}
                </span>
                <span>{st.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 max-w-4xl w-full mx-auto flex-1 flex flex-col gap-6">
        {paramedicStep === 1 && <VoiceTriagePanel />}
        {paramedicStep === 2 && <HospitalRankerCard />}
        {paramedicStep === 3 && <EnRouteStreamer />}
      </div>
    </div>
  );
};
