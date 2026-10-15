import React from 'react';
import {
  Activity,
  Truck,
  Building2,
  Columns,
  RefreshCw,
  Volume2,
  VolumeX,
  Radio,
  FileCode,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { usePulseRoute } from './context/PulseRouteContext';
import { AmbulanceHUD } from './components/ambulance/AmbulanceHUD';
import { ERCommandHUD } from './components/erCommand/ERCommandHUD';
import { RaceConditionModal } from './components/acidSimulator/RaceConditionModal';
import { FHIRPayloadModal } from './components/fhir/FHIRPayloadModal';

export function App() {
  const {
    viewMode,
    setViewMode,
    audioMuted,
    setAudioMuted,
    handleReset,
    lockedBed,
    isDispatched,
    setShowAcidModal,
    setShowFhirModal,
  } = usePulseRoute();

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-50 text-slate-900 select-none font-sans overflow-hidden">
      {/* Clean Modern Medical Top Navigation Bar */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-30 flex-shrink-0 shadow-xs">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
            <Activity className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-slate-900 leading-none">
                PulseRoute
              </span>
              <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/60">
                EMS & Bed Hold
              </span>
            </div>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              Pre-Arrival Telemetry & Direct Allocation
            </span>
          </div>
        </div>

        {/* Center: Segmented Pill View Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
          <button
            onClick={() => setViewMode('ambulance')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'ambulance'
                ? "bg-white text-blue-700 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Ambulance (Paramedic View)</span>
            <span className="md:hidden">Ambulance</span>
          </button>

          <button
            onClick={() => setViewMode('er')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'er'
                ? "bg-white text-blue-700 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Hospital ER (Receiving Bay)</span>
            <span className="md:hidden">Hospital ER</span>
          </button>

          <button
            onClick={() => setViewMode('split')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'split'
                ? "bg-white text-blue-700 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Side-by-Side Presentation Mode</span>
            <span className="md:hidden">Split Mode</span>
          </button>
        </div>

        {/* Right: Discreet Status & Actions */}
        <div className="flex items-center gap-3">
          {/* Discreet System Status */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full text-xs font-medium text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Connected to Central Dispatch</span>
          </div>

          {/* Quick FHIR Inspection Pill */}
          <button
            onClick={() => setShowFhirModal(true)}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-lg transition-colors"
            title="Inspect standard HL7 FHIR R4 JSON bundle"
          >
            <FileCode className="w-3.5 h-3.5 text-blue-600" />
            <span>FHIR Data</span>
          </button>

          {/* Quick Benchmark Pill */}
          <button
            onClick={() => setShowAcidModal(true)}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-lg transition-colors"
            title="Run ACID Bed Lock Benchmark & Stress Test"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Lock Tests</span>
          </button>

          {/* Audio Chime Mute/Unmute */}
          <button
            onClick={() => setAudioMuted(!audioMuted)}
            className={`p-2 rounded-lg border transition-all ${
              audioMuted
                ? "bg-slate-100 text-slate-400 border-slate-200"
                : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
            }`}
            title={audioMuted ? "Unmute emergency chime" : "Mute emergency chime"}
          >
            {audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Reset Cycle */}
          <button
            onClick={handleReset}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 rounded-lg transition-colors"
            title="Reset presentation cycle"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Screen Viewport */}
      <main className="flex-1 overflow-hidden relative">
        {/* Mode 1: Paramedic Fullscreen View */}
        {viewMode === 'ambulance' && (
          <div className="h-full w-full">
            <AmbulanceHUD />
          </div>
        )}

        {/* Mode 2: Hospital ER Fullscreen View */}
        {viewMode === 'er' && (
          <div className="h-full w-full">
            <ERCommandHUD />
          </div>
        )}

        {/* Mode 3: Side-by-Side Presentation Mode */}
        {viewMode === 'split' && (
          <div className="flex h-full w-full divide-x divide-slate-200">
            {/* Left: Ambulance Paramedic Flow (48%) */}
            <div className="w-1/2 h-full flex flex-col overflow-hidden">
              <AmbulanceHUD />
            </div>

            {/* Right: Hospital ER Receiving Bay (52%) */}
            <div className="w-1/2 h-full flex flex-col overflow-hidden">
              <ERCommandHUD />
            </div>
          </div>
        )}
      </main>

      {/* Auxiliary Modals for Judge Verification (Light-Themed) */}
      <RaceConditionModal />
      <FHIRPayloadModal />
    </div>
  );
}
