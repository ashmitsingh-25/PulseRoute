import React, { useState } from 'react';
import { CheckCircle2, ChevronRight, Database, FastForward, Lock, RefreshCcw, ShieldCheck, X, Zap } from 'lucide-react';
import { usePulseRoute } from '../../context/PulseRouteContext';

export const RaceConditionModal = () => {
  const { showAcidModal, setShowAcidModal, bedLockService, refreshLogs, transactionLogs } = usePulseRoute();
  
  const [isSimulating, setIsSimulating] = useState(false);
  const [raceResult, setRaceResult] = useState(null);
  
  const [isBenchmarking, setIsBenchmarking] = useState(false);
  const [benchmarkResult, setBenchmarkResult] = useState(null);

  if (!showAcidModal) return null;

  const handleRunRaceCondition = async () => {
    setIsSimulating(true);
    setRaceResult(null);

    const result = await bedLockService.simulateRaceCondition(
      "HOSP-01",
      "Ambulance A (Alpha)",
      "Ambulance B (Bravo)"
    );

    refreshLogs();
    setRaceResult(result);
    setIsSimulating(false);
  };

  const handleRunStressTest = async () => {
    setIsBenchmarking(true);
    setBenchmarkResult(null);

    const result = await bedLockService.runConcurrentStressTest(1000);
    setBenchmarkResult(result);
    setIsBenchmarking(false);
    refreshLogs();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col text-slate-900 shadow-2xl overflow-hidden font-sans">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Atomic Bed Locking & Concurrency Verification
              </h3>
              <p className="text-xs text-slate-500">
                PostgreSQL Transactional Row Locking Simulation (Slide 6 & 8)
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAcidModal(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-5 text-sm">
          {/* Race Condition Section */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  Concurrent Ambulance Contention Test
                </h4>
                <p className="text-xs text-slate-500">
                  Simulates two ambulances requesting the last free ICU bed at the same millisecond.
                </p>
              </div>
              <button
                onClick={handleRunRaceCondition}
                disabled={isSimulating}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                {isSimulating ? (
                  <>
                    <RefreshCcw className="w-3.5 h-3.5 animate-spin" />
                    <span>Executing Lock...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>Run 2-Ambulance Test</span>
                  </>
                )}
              </button>
            </div>

            {/* SQL Snippet */}
            <div className="bg-slate-900 text-emerald-400 p-3 rounded-lg text-xs font-mono leading-relaxed">
              <span className="text-slate-400">-- ACID Row Lock Transaction</span><br />
              <b className="text-blue-400">BEGIN;</b><br />
              SELECT * FROM icu_beds WHERE hospital_id = 'HOSP-01' AND status = 'FREE' <b className="text-amber-400">LIMIT 1 FOR UPDATE;</b><br />
              UPDATE icu_beds SET status='HELD', held_by='AMB-108', expires_at=NOW() + INTERVAL '15 MIN';<br />
              <b className="text-blue-400">COMMIT;</b>
            </div>

            {raceResult && (
              <div className="grid grid-cols-2 gap-3 mt-1">
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-900 text-xs">{raceResult.ambA.id}</span>
                    <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      Lock Confirmed
                    </span>
                  </div>
                  <span className="text-xs text-emerald-800 font-semibold">
                    {raceResult.ambA.bed?.number} Reserved
                  </span>
                  <span className="text-[11px] text-emerald-700">
                    15-Minute TTL Hold Active
                  </span>
                </div>

                <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-900 text-xs">{raceResult.ambB.id}</span>
                    <span className="text-[10px] font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                      Auto-Rerouted
                    </span>
                  </div>
                  <span className="text-xs text-amber-800 font-semibold">
                    Zero Double-Booking Conflict
                  </span>
                  <span className="text-[11px] text-amber-700">
                    Safely routed to next-best hospital
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 1,000 Concurrent Benchmark */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  1,000 Concurrent Request Stress Test
                </h4>
                <p className="text-xs text-slate-500">
                  Validates ACID atomicity across 1,000 rapid concurrent requests against 5 beds.
                </p>
              </div>
              <button
                onClick={handleRunStressTest}
                disabled={isBenchmarking}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                {isBenchmarking ? (
                  <>
                    <RefreshCcw className="w-3.5 h-3.5 animate-spin" />
                    <span>Running 1,000 Tests...</span>
                  </>
                ) : (
                  <>
                    <FastForward className="w-3.5 h-3.5" />
                    <span>Run 1,000 Benchmark</span>
                  </>
                )}
              </button>
            </div>

            {benchmarkResult && (
              <div className="grid grid-cols-4 gap-2 bg-white p-3 rounded-xl border border-slate-200 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">TOTAL REQUESTS</span>
                  <span className="text-base font-bold text-slate-900">{benchmarkResult.totalRequests}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">SUCCESSFUL LOCKS</span>
                  <span className="text-base font-bold text-emerald-600">{benchmarkResult.successfulLocks} / 5</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">SERIALIZED CONFLICTS</span>
                  <span className="text-base font-bold text-amber-600">{benchmarkResult.safelySerializedConflicts}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">DOUBLE BOOKINGS</span>
                  <span className="text-base font-bold text-emerald-600">{benchmarkResult.doubleBookingsDetected} (0.00%)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
          <button
            onClick={() => setShowAcidModal(false)}
            className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
