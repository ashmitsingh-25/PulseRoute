import React from 'react';
import { Navigation, Clock, Lock, CheckCircle2, Sliders, RefreshCw, AlertCircle, Heart } from 'lucide-react';
import { usePulseRoute } from '../../context/PulseRouteContext';
import { MiniECGCanvas } from '../common/MiniECGCanvas';

export const EnRouteStreamer = () => {
  const {
    isDispatched,
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
    <div className="flex flex-col gap-5">
      {/* Step Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
          Step 3 • Active Transit HUD
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          Live Telemetry Transmitting
        </span>
      </div>

      {/* Big Reassurance Banner: Bed Locked */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-emerald-950">
              {lockedBed ? lockedBed.number : "Bed #4"} Reserved & Locked
            </h3>
            <p className="text-xs text-emerald-700">
              Direct hold confirmed at {targetHospital.name}. Bed cannot be double-booked.
            </p>
          </div>
        </div>

        <div className="text-right bg-white px-3.5 py-2 rounded-xl border border-emerald-200/80 shadow-2xs">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Hold Remaining
          </span>
          <span className="text-base font-bold text-emerald-700 metric-num">
            {formatTime(bedLockTimeRemaining)}
          </span>
        </div>
      </div>

      {/* GPS & Navigation Indicator Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Destination Hospital
              </span>
              <h4 className="text-base font-bold text-slate-900">
                {targetHospital.name}
              </h4>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-medium text-slate-400 block">
              Estimated Arrival
            </span>
            <div className="flex items-baseline justify-end gap-1">
              <span className="text-2xl font-bold text-blue-600 metric-num">
                {currentEtaMinutes}
              </span>
              <span className="text-xs font-semibold text-slate-600">mins</span>
              <span className="text-xs text-slate-400 ml-1.5 font-medium">({distanceRemainingKm} km)</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs text-slate-500 font-medium">
            <span>En Route • Priority Blue Code</span>
            <span>Speed 62 km/h</span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full w-2/3 transition-all duration-500" />
          </div>
        </div>
      </div>

      {/* Live Monitor ECG & Vitals Adjustment */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-emerald-600" />
            <h4 className="font-bold text-slate-900 text-sm">
              Live Ambulance Telemetry
            </h4>
          </div>
          <span className="text-xs text-slate-500">
            Streaming to Trauma Bay 4
          </span>
        </div>

        {/* Crisp ECG Canvas */}
        <MiniECGCanvas heartRate={liveVitals.heartRate} height={75} isSTEMI={true} />

        {/* Quick Demo Controls */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex flex-col gap-2">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-blue-600" />
            Live Vitals Simulator (Adjust to Test ER Handshake):
          </span>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-white p-2 rounded-lg border border-slate-200 flex flex-col justify-between">
              <span className="text-[11px] text-slate-500">Heart Rate: <strong>{liveVitals.heartRate}</strong> bpm</span>
              <div className="flex gap-1 mt-1.5">
                <button
                  onClick={() => handleVitalAdjust('heartRate', -5)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-1 rounded font-semibold text-center"
                >
                  -5
                </button>
                <button
                  onClick={() => handleVitalAdjust('heartRate', +5)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-1 rounded font-semibold text-center"
                >
                  +5
                </button>
              </div>
            </div>

            <div className="bg-white p-2 rounded-lg border border-slate-200 flex flex-col justify-between">
              <span className="text-[11px] text-slate-500">SpO2: <strong>{liveVitals.spO2}%</strong></span>
              <div className="flex gap-1 mt-1.5">
                <button
                  onClick={() => handleVitalAdjust('spO2', -2)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-1 rounded font-semibold text-center"
                >
                  -2%
                </button>
                <button
                  onClick={() => handleVitalAdjust('spO2', +2)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-1 rounded font-semibold text-center"
                >
                  +2%
                </button>
              </div>
            </div>

            <div className="bg-white p-2 rounded-lg border border-slate-200 flex flex-col justify-between">
              <span className="text-[11px] text-slate-500">BP: <strong>{liveVitals.bpSystolic}</strong> mmHg</span>
              <div className="flex gap-1 mt-1.5">
                <button
                  onClick={() => handleVitalAdjust('bpSystolic', -5)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-1 rounded font-semibold text-center"
                >
                  -5
                </button>
                <button
                  onClick={() => handleVitalAdjust('bpSystolic', +5)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-1 rounded font-semibold text-center"
                >
                  +5
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => setParamedicStep(1)}
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            Review Patient Details
          </button>
          <button
            onClick={handleReleaseBed}
            className="text-xs font-semibold text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-red-200 transition-colors"
          >
            Cancel / Divert Ambulance
          </button>
        </div>
      </div>
    </div>
  );
};
