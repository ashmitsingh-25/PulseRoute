import React from 'react';
import { BedDouble, Lock, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { usePulseRoute } from '../../context/PulseRouteContext';

export const HospitalResourceGrid = () => {
  const {
    lockedBed,
    bedLockTimeRemaining,
    activeAmbulanceId,
    handleExtendLock,
    handleReleaseBed,
  } = usePulseRoute();

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 6 Representative Bed Slots for ER Intake
  const erBeds = [
    { number: "Bed #1", type: "CCU / Cardiac", status: "Occupied", patient: "Post-PCI Patient" },
    { number: "Bed #2", type: "CCU / Cardiac", status: "Occupied", patient: "Arrythmia Mon." },
    { number: "Bed #3", type: "ICU / Trauma", status: "Occupied", patient: "Trauma Recovery" },
    {
      number: "Bed #4",
      type: "CCU Resuscitation",
      status: lockedBed ? "Reserved" : "Available",
      patient: lockedBed ? `Inbound ${activeAmbulanceId}` : "Clean & Ready",
      isTarget: true,
    },
    { number: "Bed #5", type: "ICU / Trauma", status: "Available", patient: "Clean & Ready" },
    { number: "Bed #6", type: "General Bay", status: "Available", patient: "Clean & Ready" },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <BedDouble className="w-5 h-5 text-blue-600" />
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Bed Allocation & Facility Capacity
            </h3>
            <span className="text-xs text-slate-500">
              6 Critical Care Beds • Dedicated Cath-Lab Standby
            </span>
          </div>
        </div>

        {lockedBed && (
          <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-xs font-semibold text-emerald-800">
              Hold Expires in {formatTime(bedLockTimeRemaining)}
            </span>
          </div>
        )}
      </div>

      {/* 6 Beds Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {erBeds.map((bed, idx) => {
          const isHeld = lockedBed && bed.isTarget;
          const isOccupied = bed.status === "Occupied";
          const isFree = !isHeld && !isOccupied;

          return (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border-2 transition-all flex flex-col justify-between ${
                isHeld
                  ? "bg-amber-50/60 border-amber-400 shadow-xs ring-1 ring-amber-300/40"
                  : isOccupied
                  ? "bg-slate-50 border-slate-200 text-slate-400"
                  : "bg-white border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-900 text-sm">
                  {bed.number}
                </span>
                {isHeld ? (
                  <span className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-xs">
                    <Lock className="w-3.5 h-3.5" />
                  </span>
                ) : isOccupied ? (
                  <span className="w-2 h-2 rounded-full bg-slate-300" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                )}
              </div>

              <div>
                <span className="text-[11px] font-medium text-slate-400 block">
                  {bed.type}
                </span>
                <span className={`text-xs font-semibold mt-0.5 block truncate ${
                  isHeld
                    ? "text-amber-800"
                    : isOccupied
                    ? "text-slate-500"
                    : "text-emerald-700"
                }`}>
                  {isHeld ? `Reserved for ${activeAmbulanceId}` : bed.status}
                </span>
                <span className="text-[10px] text-slate-400 truncate block mt-0.5">
                  {bed.patient}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bed Actions if locked */}
      {lockedBed && (
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">
            Lock prevents duplicate intake until ambulance arrives or TTL expires.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExtendLock}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-colors"
            >
              Extend Hold (+5 Mins)
            </button>
            <button
              onClick={handleReleaseBed}
              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg font-semibold border border-red-200 transition-colors"
            >
              Release Bed
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
