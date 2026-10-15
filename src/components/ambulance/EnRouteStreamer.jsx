import React from 'react';
import { Navigation, Clock, Lock, CheckCircle2, Sliders, Heart } from 'lucide-react';
import { usePulseRoute } from '../../context/PulseRouteContext';
import { MiniECGCanvas } from '../common/MiniECGCanvas';

export const EnRouteStreamer = () => {
  const {
    currentEtaMinutes,
    distanceRemainingKm,
    liveVitals,
    setLiveVitals,
    lockedBed,
    bedLockTimeRemaining,
    hospitals,
    selectedHospitalId,
    handleReleaseBed,
    setParamedicStep,
  } = usePulseRoute();

  const targetHospital = hospitals.find((h) => h.id === selectedHospitalId) || hospitals[0];

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVitalAdjust = (field, delta) => {
    setLiveVitals((prev) => ({
      ...prev,
      [field]: Math.max(30, prev[field] + delta),
    }));
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Step Header Indicator */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
          Step 3 • Active Transit HUD
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          Live Telemetry Link Active
        </span>
      </div>

      {/* Reassurance Banner: Bed Locked */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-emerald-950">
              {lockedBed ? lockedBed.number : "Bed #4"} Locked at {targetHospital.name}
            </h3>
            <p className="text-[11px] text-emerald-700">
              Zero double-booking lock active. Trauma bay ready for arrival.
            </p>
          </div>
        </div>

        <div className="text-right bg-white px-3 py-1.5 rounded-lg border border-emerald-200/80 shadow-2xs">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Hold Remaining
          </span>
          <span className="text-sm font-bold text-emerald-700 metric-num">
            {formatTime(bedLockTimeRemaining)}
          </span>
        </div>
      </div>

      {/* GPS & Navigation Indicator Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Destination
              </span>
              <h4 className="text-xs font-bold text-slate-900">
                {targetHospital.name}
              </h4>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-medium text-slate-400 block">
              Estimated Arrival
            </span>
            <div className="flex items-baseline justify-end gap-1">
              <span className="text-xl font-bold text-blue-600 metric-num">
                {currentEtaMinutes}
              </span>
              <span className="text-xs font-semibold text-slate-600">mins</span>
              <span className="text-xs text-slate-400 ml-1 font-medium">({distanceRemainingKm} km)</span>
            </div>
          </div>
        </div>

        {/* Route Progress Bar */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-[11px] text-slate-500 font-medium">
            <span>En Route • Priority Ambulance Run</span>
            <span>Live GPS Sync</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full w-3/4 transition-all duration-500" />
          </div>
        </div>
      </div>

      {/* Live Monitor ECG & Vitals Simulator Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-emerald-600" />
            <h4 className="font-bold text-slate-900 text-xs">
              Live Ambulance Telemetry
            </h4>
          </div>
          <span className="text-[11px] text-slate-500">
            Streaming to Trauma Bay 4
          </span>
        </div>

        {/* Lead II Rhythm Waveform */}
        <div className="mb-3">
          <MiniECGCanvas heartRate={liveVitals.heartRate} height={70} isSTEMI={true} />
        </div>

        {/* Quick Demo Controls */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 flex flex-col gap-2">
          <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-blue-600" />
            Demo Telemetry Injector:
          </span>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-white p-2 rounded-md border border-slate-200 flex flex-col justify-between">
              <span className="text-[10px] text-slate-500">Heart Rate: <strong>{liveVitals.heartRate}</strong> bpm</span>
              <div className="flex gap-1 mt-1">
                <button
                  onClick={() => handleVitalAdjust('heartRate', -5)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-0.5 rounded text-[11px] font-semibold text-center"
                >
                  -5
                </button>
                <button
                  onClick={() => handleVitalAdjust('heartRate', +5)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-0.5 rounded text-[11px] font-semibold text-center"
                >
                  +5
                </button>
              </div>
            </div>

            <div className="bg-white p-2 rounded-md border border-slate-200 flex flex-col justify-between">
              <span className="text-[10px] text-slate-500">SpO2: <strong>{liveVitals.spO2}%</strong></span>
              <div className="flex gap-1 mt-1">
                <button
                  onClick={() => handleVitalAdjust('spO2', -2)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-0.5 rounded text-[11px] font-semibold text-center"
                >
                  -2%
                </button>
                <button
                  onClick={() => handleVitalAdjust('spO2', +2)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-0.5 rounded text-[11px] font-semibold text-center"
                >
                  +2%
                </button>
              </div>
            </div>

            <div className="bg-white p-2 rounded-md border border-slate-200 flex flex-col justify-between">
              <span className="text-[10px] text-slate-500">BP: <strong>{liveVitals.bpSystolic}</strong> mmHg</span>
              <div className="flex gap-1 mt-1">
                <button
                  onClick={() => handleVitalAdjust('bpSystolic', -5)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-0.5 rounded text-[11px] font-semibold text-center"
                >
                  -5
                </button>
                <button
                  onClick={() => handleVitalAdjust('bpSystolic', +5)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-0.5 rounded text-[11px] font-semibold text-center"
                >
                  +5
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 mt-1 border-t border-slate-100">
          <button
            onClick={() => setParamedicStep(1)}
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            Review Patient Details
          </button>
          <button
            onClick={handleReleaseBed}
            className="text-xs font-semibold text-red-600 hover:bg-red-50 px-2.5 py-1 rounded-md border border-red-200 transition-colors"
          >
            Cancel / Divert Ambulance
          </button>
        </div>
      </div>
    </div>
  );
};
