import React from 'react';
import { Building2, Volume2, VolumeX, RefreshCw, Clock, ShieldCheck } from 'lucide-react';
import { usePulseRoute } from '../../context/PulseRouteContext';
import { InboundAlertBanner } from './InboundAlertBanner';
import { LiveTelemetryStrip } from './LiveTelemetryStrip';
import { HospitalResourceGrid } from './HospitalResourceGrid';
import { PreArrivalChecklist } from './PreArrivalChecklist';

export const ERCommandHUD = () => {
  const {
    hospitals,
    selectedHospitalId,
    setSelectedHospitalId,
    audioMuted,
    setAudioMuted,
    handleReset,
    inboundEmergencyActive,
  } = usePulseRoute();

  const currentHospital = hospitals.find((h) => h.id === selectedHospitalId) || hospitals[0];

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 overflow-y-auto">
      {/* ER Operations Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <select
                value={selectedHospitalId}
                onChange={(e) => setSelectedHospitalId(e.target.value)}
                className="bg-transparent font-bold text-base text-slate-900 cursor-pointer focus:outline-none hover:text-blue-600 transition-colors"
              >
                {hospitals.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name}
                  </option>
                ))}
              </select>
              <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                Receiving Emergencies
              </span>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              Emergency Department • Trauma Intake Bay 4
            </span>
          </div>
        </div>

        {/* Chime & Reset Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAudioMuted(!audioMuted)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              audioMuted
                ? "bg-slate-100 text-slate-400 border-slate-200"
                : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
            }`}
            title="Toggle emergency audio chime"
          >
            {audioMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>{audioMuted ? "Chime Off" : "Chime Active"}</span>
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-all"
            title="Reset presentation state"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Main ER Command Dashboard Body */}
      <div className="p-6 max-w-5xl w-full mx-auto flex-1 flex flex-col gap-6">
        {/* 1. Inbound Emergency Alert Banner */}
        <InboundAlertBanner />

        {/* 2. Patient Vitals & Lead Monitor */}
        <LiveTelemetryStrip />

        {/* 3. Bed Allocation Tile */}
        <HospitalResourceGrid />

        {/* 4. Pre-Arrival Checklist */}
        <PreArrivalChecklist />
      </div>
    </div>
  );
};
