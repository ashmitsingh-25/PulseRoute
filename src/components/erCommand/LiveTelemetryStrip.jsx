import React from 'react';
import { Activity, Heart, Shield, Waves } from 'lucide-react';
import { usePulseRoute } from '../../context/PulseRouteContext';
import { MiniECGCanvas } from '../common/MiniECGCanvas';
import { VitalBox } from '../common/VitalBox';

export const LiveTelemetryStrip = () => {
  const {
    liveVitals,
    clinicalMetrics,
    inboundEmergencyActive,
    patientCard,
  } = usePulseRoute();

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-slate-900 text-base">
            Patient Vitals & Cardiac Rhythm
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
            inboundEmergencyActive
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-slate-100 text-slate-600 border-slate-200"
          }`}>
            <span className={`w-2 h-2 rounded-full ${inboundEmergencyActive ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
            {inboundEmergencyActive ? "Live Telemetry Streaming" : "Standby Mode"}
          </span>
        </div>
      </div>

      {/* 4 Large Vital Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <VitalBox
          label="Heart Rate"
          value={liveVitals.heartRate}
          unit="bpm"
          color={liveVitals.heartRate > 105 ? "amber" : "green"}
          subtext={liveVitals.heartRate > 100 ? "Tachycardic" : "Normal Sinus"}
        />
        <VitalBox
          label="Blood Pressure"
          value={`${liveVitals.bpSystolic}/${liveVitals.bpDiastolic}`}
          unit="mmHg"
          color={liveVitals.bpSystolic < 95 ? "red" : "amber"}
          subtext={`MAP ${clinicalMetrics.map}`}
        />
        <VitalBox
          label="Oxygen Saturation"
          value={liveVitals.spO2}
          unit="%"
          color={liveVitals.spO2 < 92 ? "red" : "cyan"}
          subtext={liveVitals.spO2 < 92 ? "Hypoxia" : "Adequate"}
        />
        <VitalBox
          label="Respiration Rate"
          value={liveVitals.respirationRate}
          unit="/min"
          color={liveVitals.respirationRate > 22 ? "amber" : "green"}
          subtext="Tachypneic"
        />
      </div>

      {/* Crisp High-Contrast ECG Rhythm Waveform */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-emerald-600" />
            Continuous Lead II Cardiac Vector {patientCard.requiresCathLab && "• ST-Elevation Pattern Detected"}
          </span>
          <span className="text-slate-400">25 mm/s • Standard Lead Amplitude</span>
        </div>
        <MiniECGCanvas heartRate={liveVitals.heartRate} height={90} isSTEMI={patientCard.requiresCathLab} />
      </div>
    </div>
  );
};
