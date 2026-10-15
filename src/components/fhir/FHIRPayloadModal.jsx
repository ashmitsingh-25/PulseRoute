import React, { useState } from 'react';
import { Check, Clipboard, Download, FileJson, X } from 'lucide-react';
import { usePulseRoute } from '../../context/PulseRouteContext';
import { FHIRService } from '../../services/FHIRService';

export const FHIRPayloadModal = () => {
  const {
    showFhirModal,
    setShowFhirModal,
    patientCard,
    hospitals,
    selectedHospitalId,
    lockedBed,
    activeAmbulanceId,
  } = usePulseRoute();

  const [copied, setCopied] = useState(false);

  if (!showFhirModal) return null;

  const currentHospital = hospitals.find((h) => h.id === selectedHospitalId) || hospitals[0];
  const fhirBundle = FHIRService.generateFHIRBundle(
    patientCard,
    currentHospital,
    lockedBed,
    activeAmbulanceId
  );

  const jsonString = JSON.stringify(fhirBundle, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FHIR-R4-Emergency-${patientCard.patientId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden font-sans">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <FileJson className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                HL7 FHIR R4 Standard Clinical Bundle
              </h3>
              <p className="text-xs text-slate-500">
                ABDM & International EHR Interoperability Payload
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Clipboard className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy JSON"}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-lg text-xs font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
            <button
              onClick={() => setShowFhirModal(false)}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* JSON Code Viewer */}
        <div className="p-6 overflow-y-auto bg-slate-900 flex-1">
          <pre className="text-xs font-mono text-emerald-400 leading-relaxed whitespace-pre overflow-x-auto selection:bg-emerald-500/20">
            {jsonString}
          </pre>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Standardized with LOINC & SNOMED CT clinical emergency terminologies</span>
          <button
            onClick={() => setShowFhirModal(false)}
            className="px-4 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
