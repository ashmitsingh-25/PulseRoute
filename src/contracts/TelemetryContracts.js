/**
 * Telemetry Contracts - High-frequency streaming contracts for vitals, ECG waveforms, and GPS
 */

export const TELEMETRY_INTERVAL_MS = 1000;

export const computeClinicalMetrics = (vitals) => {
  const { heartRate, bpSystolic, bpDiastolic } = vitals;
  
  // Shock Index = HR / SBP. Normal: 0.5 - 0.7. > 0.9 suggests occult shock/hemorrhage
  const shockIndex = bpSystolic > 0 ? (heartRate / bpSystolic).toFixed(2) : "0.00";
  
  // Mean Arterial Pressure (MAP) = (2 * DBP + SBP) / 3. Normal: 70 - 100 mmHg
  const map = Math.round((2 * bpDiastolic + bpSystolic) / 3);

  let statusSeverity = "NORMAL";
  if (shockIndex > 1.0 || vitals.spO2 < 90 || bpSystolic < 90 || heartRate > 130) {
    statusSeverity = "CRITICAL";
  } else if (shockIndex > 0.8 || vitals.spO2 < 94 || bpSystolic < 100) {
    statusSeverity = "WARNING";
  }

  return {
    shockIndex: parseFloat(shockIndex),
    map,
    statusSeverity,
  };
};

export const TELEMETRY_EVENTS = {
  VITALS_UPDATE: "telemetry:vitals_update",
  ECG_TICK: "telemetry:ecg_tick",
  GPS_TICK: "telemetry:gps_tick",
  BED_LOCK_REQUEST: "bed:lock_request",
  BED_LOCK_SUCCESS: "bed:lock_success",
  BED_LOCK_FAILED: "bed:lock_failed",
  BED_RELEASED: "bed:released",
  BED_EXTENDED: "bed:extended",
  AMBULANCE_DISPATCHED: "ambulance:dispatched",
  CHECKLIST_TOGGLE: "checklist:toggle",
};
