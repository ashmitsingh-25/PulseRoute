import React from 'react';
import {
  Activity,
  Truck,
  Building2,
  Columns,
  RefreshCw,
  Volume2,
  VolumeX,
  FileCode,
  ShieldCheck,
  LayoutGrid,
} from 'lucide-react';
import { usePulseRoute } from './context/PulseRouteContext';
import { LandingPage } from './components/landing/LandingPage';
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
    setShowAcidModal,
    setShowFhirModal,
  } = usePulseRoute();

  // Normalize viewMode to handle both 'ambulance'/'paramedic' and 'er'/'hospital'
  const isLanding = viewMode === 'landing';
  const isParamedic = viewMode === 'paramedic' || viewMode === 'ambulance';
  const isHospital = viewMode === 'hospital' || viewMode === 'er';
  const isSplit = viewMode === 'split';

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-50 text-slate-900 select-none font-sans overflow-hidden">
      {/* 2. Universal Fixed Top Navigation Bar (Strict Rhythm & Baseline) */}
      <header className="h-16 px-6 flex items-center justify-between border-b border-slate-200 bg-white z-30 flex-shrink-0 shadow-2xs">
        {/* Left Section: Logo + Subtitle + Home Portal Trigger */}
        <div
          onClick={() => setViewMode('landing')}
          className="flex items-center gap-3 cursor-pointer group"
          title="Return to PulseRoute Portal Home"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs group-hover:bg-blue-700 transition-colors">
            <Activity className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-slate-900 leading-none group-hover:text-blue-600 transition-colors">
              PulseRoute
            </span>
            <span className="text-xs text-slate-500 font-medium mt-0.5">
              EMS & Hospital Telemetry Network
            </span>
          </div>
        </div>

        {/* Center Section: Unified Segmented View Switcher */}
        <div className="bg-slate-100 p-1 rounded-lg border border-slate-200 inline-flex items-center gap-1">
          <button
            onClick={() => setViewMode('landing')}
            className={`h-8 text-xs font-medium px-3 rounded-md flex items-center gap-2 transition-all ${
              isLanding
                ? "bg-white text-blue-700 shadow-sm font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Overview / Portal</span>
            <span className="sm:hidden">Home</span>
          </button>

          <button
            onClick={() => setViewMode('paramedic')}
            className={`h-8 text-xs font-medium px-3 rounded-md flex items-center gap-2 transition-all ${
              isParamedic
                ? "bg-white text-blue-700 shadow-sm font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Paramedic Console</span>
            <span className="md:hidden">EMS</span>
          </button>

          <button
            onClick={() => setViewMode('hospital')}
            className={`h-8 text-xs font-medium px-3 rounded-md flex items-center gap-2 transition-all ${
              isHospital
                ? "bg-white text-blue-700 shadow-sm font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">ER Command Bay</span>
            <span className="md:hidden">Hospital</span>
          </button>

          <button
            onClick={() => setViewMode('split')}
            className={`h-8 text-xs font-medium px-3 rounded-md flex items-center gap-2 transition-all ${
              isSplit
                ? "bg-white text-blue-700 shadow-sm font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Dual-Screen Demo</span>
            <span className="lg:hidden">Demo</span>
          </button>
        </div>

        {/* Right Section: System Controls (Uniform h-8 Visual Rhythm) */}
        <div className="flex items-center gap-2">
          {/* Status Indicator */}
          <div className="hidden xl:flex h-8 px-3 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Dispatch Network Active</span>
          </div>

          {/* Action Button: FHIR Data */}
          <button
            onClick={() => setShowFhirModal(true)}
            className="h-8 px-2.5 rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
            title="Inspect standard HL7 FHIR R4 emergency JSON payload"
          >
            <FileCode className="w-4 h-4 text-blue-600" />
            <span className="hidden sm:inline">FHIR Data</span>
          </button>

          {/* Action Button: Lock Tests */}
          <button
            onClick={() => setShowAcidModal(true)}
            className="h-8 px-2.5 rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
            title="Run ACID Bed Lock Benchmark & Stress Test"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Lock Tests</span>
          </button>

          {/* Action Button: Audio Chime Toggle */}
          <button
            onClick={() => setAudioMuted(!audioMuted)}
            className={`h-8 px-2.5 rounded-md border text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs ${
              audioMuted
                ? "bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200/60"
                : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100/60"
            }`}
            title={audioMuted ? "Unmute emergency audio chime" : "Mute emergency audio chime"}
          >
            {audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{audioMuted ? "Muted" : "Chime"}</span>
          </button>

          {/* Action Button: Reset Demo */}
          <button
            onClick={handleReset}
            className="h-8 px-2.5 rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
            title="Reset presentation state to initial case"
          >
            <RefreshCw className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </header>

      {/* 3. Main Operational Viewport (Strict h-[calc(100vh-4rem)] & Edge Alignment) */}
      <main className="h-[calc(100vh-4rem)] w-full bg-slate-50 overflow-hidden relative">
        {/* Landing Page Route */}
        {isLanding && <LandingPage />}

        {/* Paramedic Fullscreen Route */}
        {isParamedic && (
          <div className="h-full w-full overflow-y-auto p-4 md:p-6 flex justify-center">
            <div className="max-w-4xl w-full h-full flex flex-col gap-4">
              <AmbulanceHUD />
            </div>
          </div>
        )}

        {/* Hospital ER Fullscreen Route */}
        {isHospital && (
          <div className="h-full w-full overflow-y-auto p-4 md:p-6 flex justify-center">
            <div className="max-w-5xl w-full h-full flex flex-col gap-4">
              <ERCommandHUD />
            </div>
          </div>
        )}

        {/* Presentation Split-Screen Route */}
        {isSplit && (
          <div className="h-full w-full p-4 overflow-hidden">
            <div className="grid grid-cols-12 gap-4 h-full">
              {/* Left Column: Paramedic EMS Console (5 cols) */}
              <div className="col-span-12 lg:col-span-5 h-full overflow-hidden flex flex-col gap-4">
                <AmbulanceHUD />
              </div>

              {/* Right Column: Hospital ER Command Center (7 cols) */}
              <div className="col-span-12 lg:col-span-7 h-full overflow-hidden flex flex-col gap-4 pl-0 lg:pl-1 border-t lg:border-t-0 lg:border-l border-slate-200">
                <ERCommandHUD />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Auxiliary Modals for Live Presentation & Evaluation */}
      <RaceConditionModal />
      <FHIRPayloadModal />
    </div>
  );
}
