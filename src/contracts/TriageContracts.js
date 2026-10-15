/**
 * Triage Contracts - Clinical schemas and interfaces for PulseRoute
 * Follows ESI (Emergency Severity Index v4) and HL7 FHIR emergency guidelines.
 */

export const ESI_LEVELS = {
  1: { level: 1, name: "RESUSCITATION", color: "#E53935", bg: "#2A1215", desc: "Immediate life-saving intervention needed" },
  2: { level: 2, name: "EMERGENT", color: "#FB8C00", bg: "#2B1A0A", desc: "High risk, confused/lethargic, or severe pain/distress" },
  3: { level: 3, name: "URGENT", color: "#FDD835", bg: "#2B290A", desc: "Multiple resources needed, vitals stable" },
  4: { level: 4, name: "LESS URGENT", color: "#0288D1", bg: "#092233", desc: "One resource needed" },
  5: { level: 5, name: "NON-URGENT", color: "#00C853", bg: "#0C2417", desc: "No resources needed, minor complaint" },
};

/**
 * Standard structured triage card model extracted from voice or telemetry
 */
export const createEmptyTriageCard = () => ({
  patientId: `PT-${Math.floor(1000 + Math.random() * 9000)}`,
  timestamp: new Date().toISOString(),
  age: 54,
  sex: "M",
  complaint: "Crushing retrosternal chest pain radiating to left arm",
  vitals: {
    bpSystolic: 90,
    bpDiastolic: 60,
    heartRate: 112,
    spO2: 91,
    respirationRate: 24,
    temperature: 37.1,
    gcs: 14,
  },
  symptoms: ["Diaphoresis", "Left arm radiation", "Dyspnea", "Pale skin"],
  suspectedCondition: "Acute Coronary Syndrome (STEMI / NSTEMI)",
  requiredSpecialty: "CARDIOLOGY", // 'CARDIOLOGY' | 'NEUROLOGY' | 'TRAUMA' | 'PEDIATRICS' | 'GENERAL'
  requiredBedType: "ICU_CCU", // 'ICU_CCU' | 'NEURO_ICU' | 'TRAUMA_BAY' | 'PICU' | 'GENERAL_ER'
  requiresCathLab: true,
  requiresVentilator: false,
  esi: 2,
  confidence: 0.94,
  lowConfidenceFields: [],
  checklist: [
    "Activate 24/7 Primary PCI Cath-Lab team",
    "Alert Interventional Cardiologist on-call",
    "Prep CCU Bed with telemetry monitor & 12-lead ECG",
    "Prepare Defibrillator, Heparin, Aspirin 325mg & IV Nitro kit"
  ],
  transcription: "Male, 54, crushing chest pain radiating to left arm, BP 90 over 60, SpO2 91%, diaphoresis, acute distress",
  language: "en-US",
});
