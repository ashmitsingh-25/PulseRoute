import React from 'react';
import { AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { usePulseRoute } from '../../context/PulseRouteContext';

export const InboundAlertBanner = () => {
  const {
    inboundEmergencyActive,
    erFlashAlert,
    activeAmbulanceId,
    patientCard,
    currentEtaMinutes,
    distanceRemainingKm,
    lockedBed,
  } = usePulseRoute();

  if (!inboundEmergencyActive) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="font-semibold text-slate-700">
            Receiving Bay Standby
          </span>
          <span className="text-slate-400">
            • Trauma Bay 4 Ready • Critical lines active
          </span>
        </div>
        <span className="font-medium text-slate-400 text-[11px]">
          Awaiting Paramedic Inbound Dispatch
        </span>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border p-4 transition-all duration-300 shadow-sm flex items-center justify-between ${
        erFlashAlert
          ? "bg-red-50 border-red-300 ring-2 ring-red-400/30 animate-soft-alert"
          : "bg-red-50 border-red-200"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-red-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider">
              Priority Inbound Emergency
            </span>
            <span className="text-[10px] font-semibold bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
              ESI Level {patientCard.esi}
            </span>
          </div>
          <h3 className="text-sm font-bold text-red-950 mt-0.5">
            Ambulance {activeAmbulanceId} — {patientCard.age}Y {patientCard.sex === 'M' ? 'Male' : 'Female'} ({patientCard.suspectedCondition})
          </h3>
          <p className="text-xs text-red-700 font-medium mt-0.5">
            Holding {lockedBed ? lockedBed.number : "Bed #4"} • Emergency protocol in progress
          </p>
        </div>
      </div>

      <div className="text-right bg-white px-3.5 py-2 rounded-lg border border-red-200 shadow-2xs flex-shrink-0">
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
          Estimated Arrival
        </span>
        <div className="flex items-baseline justify-end gap-1">
          <span className="text-xl font-bold text-red-600 metric-num">
            {currentEtaMinutes}
          </span>
          <span className="text-xs font-semibold text-slate-700">mins</span>
          <span className="text-[11px] text-slate-400 font-medium ml-1">({distanceRemainingKm} km)</span>
        </div>
      </div>
    </div>
  );
};
