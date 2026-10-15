/**
 * Routing Contracts - Multi-factor Clinical Cost Function & Hard Filter Rules
 * 
 * Score = w1 * ETA + w2 * BedGap + w3 * SpecialistGap + w4 * ERLoad
 * Lowest score wins. Hard constraints prune hospitals without required specialty/equipment first.
 */

export const DEFAULT_ROUTING_WEIGHTS = {
  w1_eta: 1.0,           // weight for live drive time minutes
  w2_bedGap: 3.5,        // heavy penalty if ICU/CCU bed shortfall
  w3_specialistGap: 4.0, // critical penalty if on-call sub-specialist is missing/off-call
  w4_erLoad: 0.8,        // penalty for ER crowding percentage
};

export const FACILITY_CAPABILITIES = {
  CATH_LAB: "CATH_LAB",
  NEURO_SURGERY: "NEURO_SURGERY",
  LEVEL1_TRAUMA: "LEVEL1_TRAUMA",
  PEDIATRIC_ICU: "PEDIATRIC_ICU",
  CT_STROKE_FASTTRACK: "CT_STROKE_FASTTRACK",
  VENTILATOR_CAPACITY: "VENTILATOR_CAPACITY",
};
