import React from 'react';
import { ArrowLeft, CheckCircle2, Clock, Building2, AlertTriangle, ShieldCheck, Zap, Lock } from 'lucide-react';
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
    <div className="flex flex-col gap-5">
      {/* Back button & Title */}
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

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">
            Intelligent Destination Routing
          </h2>
          <p className="text-sm text-slate-500">
            Hospitals evaluated against patient's need for <strong className="text-slate-700 font-semibold">{patientCard.suspectedCondition}</strong> and immediate bed readiness.
          </p>
        </div>

        {/* Hospital Cards List */}
        <div className="flex flex-col gap-3">
          {rankedHospitals.slice(0, 3).map((hosp, idx) => {
            const isSelected = selectedHospitalId === hosp.id;
            const isRecommended = idx === 0 && hosp.isEligible;
            const isDisqualified = !hosp.isEligible;

            // Normalize clinical match score out of 100
            const matchScore = isDisqualified ? 38 : isRecommended ? 96 : 74;

            return (
              <div
                key={hosp.id}
                onClick={() => {
                  if (!isDispatched && hosp.isEligible) {
                    setSelectedHospitalId(hosp.id);
                  }
                }}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative ${
                  isSelected
                    ? "border-blue-600 bg-blue-50/40 shadow-sm"
                    : isDisqualified
                    ? "border-slate-200 bg-slate-50/70 hover:border-slate-300"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                {/* Header: Name, Tag, Score */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${
                      isRecommended ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                    }`}>
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm">
                          {hosp.name}
                        </h4>
                        {isRecommended && (
                          <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                            Recommended Choice
                          </span>
                        )}
                        {isDisqualified && (
                          <span className="text-[11px] font-semibold bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                            Not Suitable
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500">
                        {hosp.type} • {hosp.distanceKm} km away
                      </span>
                    </div>
                  </div>

                  {/* Match Score & ETA */}
                  <div className="text-right">
                    <div className="flex items-baseline justify-end gap-1">
                      <span className="text-xs text-slate-400 font-medium">Match:</span>
                      <span className={`text-base font-bold metric-num ${
                        isRecommended ? "text-emerald-600" : isDisqualified ? "text-slate-400" : "text-blue-600"
                      }`}>
                        {matchScore}/100
                      </span>
                    </div>
                    <div className="flex items-center justify-end gap-1 text-xs font-semibold text-slate-700 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{hosp.etaMinutes} mins drive</span>
                    </div>
                  </div>
                </div>

                {/* Clinical Readiness Highlights */}
                <div className="pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-3">
                    {/* Cath Lab Status */}
                    {hosp.capabilities.cathLab.available ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Cath-Lab On-Call & Ready
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-700 font-medium">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                        No Cardiology Team on Duty
                      </span>
                    )}

                    {/* Bed Capacity */}
                    <span className="text-slate-500">
                      • {hosp.beds.ccuFree > 0 ? `${hosp.beds.ccuFree} CCU Beds Available` : `${hosp.beds.icuFree} ICU Beds Available`}
                    </span>
                  </div>

                  {isDisqualified ? (
                    <span className="text-[11px] font-medium text-red-600 italic">
                      ⚠️ Closest facility, but lacks required emergency treatment team.
                    </span>
                  ) : isRecommended ? (
                    <span className="text-[11px] font-medium text-emerald-700">
                      Optimal destination for immediate intervention
                    </span>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        {/* Big Action Button */}
        <div className="pt-2">
          {!isDispatched ? (
            <button
              onClick={handleDispatchAndLock}
              disabled={isLockingInProgress}
              className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 active:scale-[0.99] disabled:opacity-50"
            >
              {isLockingInProgress ? (
                <>
                  <Lock className="w-5 h-5 animate-spin text-white" />
                  <span>Reserving Bed & Establishing Connection...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 fill-current text-white" />
                  <span>Reserve Bed & Dispatch Live Telemetry</span>
                </>
              )}
            </button>
          ) : (
            <div className="w-full p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="font-bold text-sm">
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
    </div>
  );
};
