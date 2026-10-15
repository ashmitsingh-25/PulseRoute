import React from 'react';
import { Building2, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
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
    inboundEmergencyActive,
  } = usePulseRoute();

  const currentHospital = hospitals.find((h) => h.id === selectedHospitalId) || hospitals[0];

  return (
    <div className="flex flex-col h-full gap-4 overflow-hidden">
      {/* Sub-header: Facility Selection & Department Status */}
      <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 flex items-center justify-between shadow-xs flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <select
                value={selectedHospitalId}
                onChange={(e) => setSelectedHospitalId(e.target.value)}
                className="bg-transparent font-bold text-sm text-slate-900 cursor-pointer focus:outline-none hover:text-blue-600 transition-colors pr-1"
              >
                {hospitals.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name}
                  </option>
                ))}
              </select>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              Emergency Department • Trauma Intake Bay 4
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Receiving Emergencies</span>
          </span>
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            • 24/7 Primary PCI Active
          </span>
        </div>
      </div>

      {/* Scrollable Clinical Command Body */}
      <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4">
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
