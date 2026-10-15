import React from 'react';
import { ArrowLeft, CheckCircle2, Clock, Building2, AlertTriangle, Zap, Lock } from 'lucide-react';
import { usePulseRoute } from '../../context/PulseRouteContext';

export const HospitalRankerCard = () => {
  const {
    rankedHospitals,
    selectedHospitalId,
    setSelectedHospitalId,
    handleDispatchAndLock,
    isLockingInProgress,
    isDispatched,
    lockedBed,
    setParamedicStep,
    patientCard,
  } = usePulseRoute();

  return (
    <div className="flex flex-col gap-4">
      {/* Back button & Stepper note */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setParamedicStep(1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Triage Assessment</span>
        </button>
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
          Step 2 • Hospital Selection
        </span>
      </div>

      {/* Main Hospital Selection Box */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              Intelligent Destination Routing
            </h3>
            <p className="text-xs text-slate-500">
              Scoring candidates for <strong className="text-slate-700 font-semibold">{patientCard.suspectedCondition}</strong> readiness
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
            3 Facilities Ranked
          </span>
        </div>

        {/* Hospital Cards List */}
        <div className="flex flex-col gap-2.5 mb-3">
          {rankedHospitals.slice(0, 3).map((hosp, idx) => {
            const isSelected = selectedHospitalId === hosp.id;
            const isRecommended = idx === 0 && hosp.isEligible;
            const isDisqualified = !hosp.isEligible;

            // Score normalization
            const matchScore = isDisqualified ? 35 : isRecommended ? 94 : 72;

            return (
              <div
                key={hosp.id}
                onClick={() => {
                  if (!isDispatched && hosp.isEligible) {
                    setSelectedHospitalId(hosp.id);
                  }
                }}
                className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                  isSelected
                    ? "border-blue-600 bg-blue-50/30 shadow-2xs"
                    : isDisqualified
                    ? "border-slate-200 bg-slate-50/60 opacity-80"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                {/* Header: Name, Tag, Score */}
                <div className="flex items-start justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-md ${
                      isRecommended ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                    }`}>
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-slate-900 text-xs">
                          {hosp.name}
                        </h4>
                        {isRecommended && (
                          <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full">
                            Recommended
                          </span>
                        )}
                        {isDisqualified && (
                          <span className="text-[10px] font-semibold bg-red-100 text-red-800 px-1.5 py-0.5 rounded-full">
                            Not Recommended
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500">
                        {hosp.type} • {hosp.distanceKm} km away
                      </span>
                    </div>
                  </div>

                  {/* Match Score & ETA */}
                  <div className="text-right">
                    <div className="flex items-baseline justify-end gap-1">
                      <span className="text-[10px] text-slate-400 font-medium">Score:</span>
                      <span className={`text-sm font-bold metric-num ${
                        isRecommended ? "text-emerald-600" : isDisqualified ? "text-slate-400" : "text-blue-600"
                      }`}>
                        {matchScore}/100
                      </span>
                    </div>
                    <div className="flex items-center justify-end gap-1 text-[11px] font-semibold text-slate-700">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{hosp.etaMinutes} mins drive</span>
                    </div>
                  </div>
                </div>

                {/* Clinical Readiness Highlights */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2.5">
                    {hosp.capabilities.cathLab.available ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Cath-Lab Ready
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-700 font-medium">
                        <AlertTriangle className="w-3 h-3 text-red-600" />
                        No Cardiology Team on Duty
                      </span>
                    )}

                    <span className="text-slate-500">
                      • {hosp.beds.ccuFree > 0 ? `${hosp.beds.ccuFree} CCU Beds Available` : `${hosp.beds.icuFree} ICU Beds`}
                    </span>
                  </div>

                  {isDisqualified && (
                    <span className="text-[10px] font-medium text-red-600">
                      ⚠️ Lacks required treatment unit
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Primary Action Button */}
        {!isDispatched ? (
          <button
            onClick={handleDispatchAndLock}
            disabled={isLockingInProgress}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
          >
            {isLockingInProgress ? (
              <>
                <Lock className="w-4 h-4 animate-spin text-white" />
                <span>Reserving Bed & Establishing Connection...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-current text-white" />
                <span>Reserve Bed & Dispatch Live Telemetry</span>
              </>
            )}
          </button>
        ) : (
          <div className="w-full p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-emerald-800 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="font-bold">
                {lockedBed ? lockedBed.number : "Bed #4"} Successfully Reserved
              </span>
            </div>
            <button
              onClick={() => setParamedicStep(3)}
              className="text-xs font-bold text-emerald-800 hover:underline"
            >
              View En Route HUD →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
