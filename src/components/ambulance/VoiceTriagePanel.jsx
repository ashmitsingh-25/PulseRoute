import React from 'react';
import { Mic, MicOff, ArrowRight, Activity, Heart, ShieldAlert, Sparkles, Check } from 'lucide-react';
import { usePulseRoute } from '../../context/PulseRouteContext';
import { VOICE_PRESETS } from '../../data/sampleVoicePresets';
import { ESI_LEVELS } from '../../contracts/TriageContracts';

export const VoiceTriagePanel = () => {
  const {
    isRecordingVoice,
    toggleRecording,
    voiceTranscript,
    selectedPresetId,
    loadPreset,
    patientCard,
    setParamedicStep,
    isDispatched,
  } = usePulseRoute();

  const currentEsi = ESI_LEVELS[patientCard.esi] || ESI_LEVELS[2];

  return (
    <div className="flex flex-col gap-5">
      {/* Recording Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">
          Step 1 • Voice Triage
        </span>
        <h2 className="text-xl font-bold text-slate-900 mb-1">
          Paramedic Audio Assessment
        </h2>
        <p className="text-sm text-slate-500 max-w-md mb-6">
          Record a 10-second hands-free clinical note, or select a pre-loaded presentation scenario below.
        </p>

        {/* Large Friendly Microphone Button */}
        <button
          onClick={toggleRecording}
          disabled={isDispatched}
          className={`group relative flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-semibold text-base transition-all duration-200 shadow-md ${
            isRecordingVoice
              ? "bg-red-600 hover:bg-red-700 text-white animate-soft-alert"
              : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg active:scale-[0.98]"
          } ${isDispatched ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isRecordingVoice ? (
            <>
              <span className="relative flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-200 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-white"></span>
              </span>
              <MicOff className="w-5 h-5" />
              <span>Listening... Tap to Stop</span>
            </>
          ) : (
            <>
              <Mic className="w-5 h-5 text-white" />
              <span>Tap to Record Clinical Voice Note</span>
            </>
          )}
        </button>

        {/* Scenario Pills */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-slate-400 font-medium mr-1">
            Quick Scenarios:
          </span>
          {VOICE_PRESETS.map((p) => {
            const isSelected = selectedPresetId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => loadPreset(p.id)}
                disabled={isDispatched}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  isSelected
                    ? "bg-blue-50 border-blue-300 text-blue-700 font-semibold shadow-xs"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                } ${isDispatched ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {p.title.split('(')[0].trim()}
              </button>
            );
          })}
        </div>

        {/* Voice Note Quote */}
        {voiceTranscript && (
          <div className="mt-5 w-full bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-left">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Transcribed Voice Note
            </span>
            <p className="text-sm text-slate-700 italic leading-relaxed">
              "{voiceTranscript}"
            </p>
          </div>
        )}
      </div>

      {/* Patient Summary Card (Extracted Clinical Facts) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Patient Assessment
            </span>
            <h3 className="text-base font-bold text-slate-900">
              {patientCard.age} Year Old {patientCard.sex === 'M' ? 'Male' : 'Female'}
            </h3>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
            patientCard.esi === 1
              ? "bg-red-50 text-red-700 border-red-200"
              : patientCard.esi === 2
              ? "bg-amber-50 text-amber-700 border-amber-200"
              : "bg-blue-50 text-blue-700 border-blue-200"
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              patientCard.esi === 1 ? 'bg-red-500' : patientCard.esi === 2 ? 'bg-amber-500' : 'bg-blue-500'
            }`} />
            ESI {patientCard.esi} — {currentEsi.name}
          </span>
        </div>

        {/* 4 Big Metric Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
            <span className="text-xs font-medium text-slate-500 block mb-1">Heart Rate</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-900 metric-num">
                {patientCard.vitals.heartRate}
              </span>
              <span className="text-xs text-slate-400">bpm</span>
            </div>
            <span className="text-[11px] font-medium text-amber-600">Elevated</span>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
            <span className="text-xs font-medium text-slate-500 block mb-1">Blood Pressure</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-900 metric-num">
                {patientCard.vitals.bpSystolic}/{patientCard.vitals.bpDiastolic}
              </span>
              <span className="text-xs text-slate-400">mmHg</span>
            </div>
            <span className="text-[11px] font-medium text-red-600">Hypotensive</span>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
            <span className="text-xs font-medium text-slate-500 block mb-1">Oxygen (SpO2)</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-900 metric-num">
                {patientCard.vitals.spO2}
              </span>
              <span className="text-xs text-slate-400">%</span>
            </div>
            <span className="text-[11px] font-medium text-sky-600">On Oxygen</span>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
            <span className="text-xs font-medium text-slate-500 block mb-1">Triage Acuity</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-amber-600 metric-num">
                Level {patientCard.esi}
              </span>
            </div>
            <span className="text-[11px] font-medium text-slate-500">Emergent Care</span>
          </div>
        </div>

        {/* Chief Complaint Description */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Chief Complaint & Suspected Condition
          </span>
          <p className="text-sm font-medium text-slate-800">
            {patientCard.complaint} — <span className="text-blue-700 font-semibold">{patientCard.suspectedCondition}</span>
          </p>
        </div>

        {/* Primary Action Button: Next Step */}
        <button
          onClick={() => setParamedicStep(2)}
          className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 group"
        >
          <span>Find Best Hospitals for Patient</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
