import React from 'react';
import { BedDouble, Lock, Clock } from 'lucide-react';
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
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col">
      {/* Standardized Card Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <div className="flex items-center gap-2">
          <BedDouble className="w-4 h-4 text-blue-600" />
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Bed Allocation & Facility Capacity
            </h3>
            <span className="text-[11px] text-slate-500">
              6 Critical Care Beds • Dedicated Cath-Lab Standby
            </span>
          </div>
        </div>

        {lockedBed && (
          <div className="flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            <Clock className="w-3 h-3 text-emerald-600" />
            <span className="text-xs font-semibold text-emerald-800">
              Hold: {formatTime(bedLockTimeRemaining)}
            </span>
          </div>
        )}
      </div>

      {/* 6 Beds Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-2">
        {erBeds.map((bed, idx) => {
          const isHeld = lockedBed && bed.isTarget;
          const isOccupied = bed.status === "Occupied";

          return (
            <div
              key={idx}
              className={`p-3 rounded-lg border-2 transition-all flex flex-col justify-between ${
                isHeld
                  ? "bg-amber-50/60 border-amber-400 shadow-2xs ring-1 ring-amber-300/40"
                  : isOccupied
                  ? "bg-slate-50 border-slate-200 text-slate-400"
                  : "bg-white border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-slate-900 text-xs">
                  {bed.number}
                </span>
                {isHeld ? (
                  <span className="w-5 h-5 rounded-md bg-amber-500 text-white flex items-center justify-center shadow-2xs">
                    <Lock className="w-3 h-3" />
                  </span>
                ) : isOccupied ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                )}
              </div>

              <div>
                <span className="text-[10px] font-medium text-slate-400 block">
                  {bed.type}
                </span>
                <span className={`text-[11px] font-semibold mt-0.5 block truncate ${
                  isHeld
                    ? "text-amber-800 font-bold"
                    : isOccupied
                    ? "text-slate-500"
                    : "text-emerald-700"
                }`}>
                  {isHeld ? `Reserved (${activeAmbulanceId})` : bed.status}
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
        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium text-[11px]">
            Lock prevents duplicate intake until ambulance arrives or TTL expires.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExtendLock}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-semibold text-xs transition-colors"
            >
              Extend Hold (+5 Mins)
            </button>
            <button
              onClick={handleReleaseBed}
              className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 rounded-md font-semibold text-xs border border-red-200 transition-colors"
            >
              Release Bed
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
