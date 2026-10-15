import React, { useState } from 'react';
import { Activity, AlertCircle, CheckCircle2, Edit3, ShieldAlert } from 'lucide-react';
import { usePulseRoute } from '../../context/PulseRouteContext';
import { VitalBox } from '../common/VitalBox';
import { StatusBadge } from '../common/StatusBadge';

export const StructuredCardEditor = () => {
  const { patientCard, setPatientCard, isDispatched } = usePulseRoute();
  const [isEditing, setIsEditing] = useState(false);

  const handleVitalChange = (field, value) => {
    setPatientCard((prev) => ({
      ...prev,
      vitals: {
        ...prev.vitals,
        [field]: parseInt(value, 10) || 0,
      },
    }));
  };

  const isLowConfidence = (fieldName) => {
    return patientCard.lowConfidenceFields?.includes(fieldName);
  };

  return (
    <div className="bg-[#111622] border border-[#1E2638] rounded-sm p-3 flex flex-col gap-2.5">
      {/* Title */}
      <div className="flex items-center justify-between pb-1.5 border-b border-[#1E2638]">
        <div className="flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-[#00C853]" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#E2E8F0]">
            STRUCTURED TRIAGE CARD // HL7-READY
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-[#64748B]">
            ID: {patientCard.patientId}
          </span>
          <button
            onClick={() => setIsEditing(!isEditing)}
            disabled={isDispatched}
            className="flex items-center gap-1 text-[10px] font-mono text-[#0288D1] hover:underline disabled:opacity-40"
          >
            <Edit3 className="w-3 h-3" />
            <span>{isEditing ? "SAVE" : "EDIT"}</span>
          </button>
        </div>
      </div>

      {/* Demographics & Primary Complaint */}
      <div className="grid grid-cols-4 gap-2 text-xs font-mono">
        <div className="col-span-1 bg-[#0B0E14] border border-[#1E2638] p-1.5 rounded-sm">
          <span className="text-[10px] text-[#64748B] block uppercase">AGE / SEX</span>
          {isEditing ? (
            <div className="flex gap-1 mt-0.5">
              <input
                type="number"
                value={patientCard.age}
                onChange={(e) => setPatientCard({ ...patientCard, age: parseInt(e.target.value) || 0 })}
                className="w-10 bg-[#151B2B] border border-[#2D374D] px-1 text-xs text-white"
              />
              <select
                value={patientCard.sex}
                onChange={(e) => setPatientCard({ ...patientCard, sex: e.target.value })}
                className="bg-[#151B2B] border border-[#2D374D] text-xs text-white"
              >
                <option value="M">M</option>
                <option value="F">F</option>
              </select>
            </div>
          ) : (
            <span className="font-bold text-[#E2E8F0]">{patientCard.age} Y / {patientCard.sex}</span>
          )}
        </div>

        <div className="col-span-3 bg-[#0B0E14] border border-[#1E2638] p-1.5 rounded-sm">
          <span className="text-[10px] text-[#64748B] block uppercase">CHIEF COMPLAINT & SUSPECTED CONDITION</span>
          <span className="font-semibold text-[#FB8C00] truncate block">
            {patientCard.complaint}
          </span>
        </div>
      </div>

      {/* Vitals Matrix */}
      <div className="grid grid-cols-4 gap-2">
        <div className={isLowConfidence('bp') ? "ring-1 ring-[#FB8C00]" : ""}>
          <VitalBox
            label="BP (SYS/DIA)"
            value={`${patientCard.vitals.bpSystolic}/${patientCard.vitals.bpDiastolic}`}
            unit="mmHg"
            color={patientCard.vitals.bpSystolic < 90 ? "red" : "amber"}
          />
        </div>
        <div className={isLowConfidence('spO2') ? "ring-1 ring-[#FB8C00]" : ""}>
          <VitalBox
            label="SpO2"
            value={patientCard.vitals.spO2}
            unit="%"
            color={patientCard.vitals.spO2 < 92 ? "red" : "cyan"}
          />
        </div>
        <div className={isLowConfidence('heartRate') ? "ring-1 ring-[#FB8C00]" : ""}>
          <VitalBox
            label="PULSE / HR"
            value={patientCard.vitals.heartRate}
            unit="bpm"
            color={patientCard.vitals.heartRate > 110 ? "red" : "green"}
          />
        </div>
        <div className={isLowConfidence('gcs') ? "ring-1 ring-[#FB8C00]" : ""}>
          <VitalBox
            label="GCS SCORE"
            value={patientCard.vitals.gcs}
            unit="/15"
            color={patientCard.vitals.gcs < 12 ? "red" : "green"}
          />
        </div>
      </div>

      {/* Pre-Arrival Action Checklist Preview */}
      <div className="bg-[#0B0E14] border border-[#1E2638] rounded-sm p-2 flex flex-col gap-1.5">
        <span className="text-[10px] font-mono uppercase text-[#64748B] flex items-center justify-between">
          <span>AI Clinical Pre-Arrival Protocol ({patientCard.checklist.length} Actions)</span>
          <StatusBadge label="VERIFIED PROTOCOL" variant="success" size="xs" />
        </span>
        <div className="flex flex-col gap-1">
          {patientCard.checklist.map((item, idx) => (
            <div key={idx} className="flex items-center gap-1.5 text-[11px] font-mono text-[#94A3B8]">
              <CheckCircle2 className="w-3 h-3 text-[#00C853] flex-shrink-0" />
              <span className="truncate">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
