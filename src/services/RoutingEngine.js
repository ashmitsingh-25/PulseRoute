/**
 * Routing Engine - Implements PulseRoute Weighted Cost Scoring & Hard Constraint Pruning
 * 
 * Formula:
 *   Score = w1 * ETA + w2 * BedGap + w3 * SpecialistGap + w4 * ERLoad
 *   (Lowest score wins)
 */

import { DEFAULT_ROUTING_WEIGHTS } from '../contracts/RoutingContracts';

export class RoutingEngine {
  constructor(weights = DEFAULT_ROUTING_WEIGHTS) {
    this.weights = weights;
  }

  setWeights(newWeights) {
    this.weights = { ...this.weights, ...newWeights };
  }

  /**
   * Evaluates and scores hospitals against patient requirements
   * @param {Object} patientCard 
   * @param {Array} hospitals 
   * @returns {Array} Ranked list of hospitals with eligibility flags and cost breakdowns
   */
  evaluateHospitals(patientCard, hospitals) {
    const { requiresCathLab, requiresVentilator, requiredBedType } = patientCard;
    const { w1_eta, w2_bedGap, w3_specialistGap, w4_erLoad } = this.weights;

    const evaluated = hospitals.map((hospital) => {
      // 1. HARD FILTER EVALUATION
      const hardFilterFailures = [];

      if (requiresCathLab && !hospital.capabilities.cathLab.available) {
        hardFilterFailures.push("CATH_LAB_OFFLINE");
      }

      if (requiresVentilator && hospital.beds.ventilatorsFree < 1) {
        hardFilterFailures.push("NO_VENTILATORS_AVAILABLE");
      }

      if (requiredBedType === 'ICU_CCU' && hospital.beds.ccuFree === 0 && hospital.beds.icuFree === 0) {
        hardFilterFailures.push("ZERO_CRITICAL_CARE_BEDS");
      }

      if (hospital.diversionStatus === 'TOTAL_DIVERSION') {
        hardFilterFailures.push("TOTAL_ER_DIVERSION");
      }

      const isEligible = hardFilterFailures.length === 0;

      // 2. METRIC GAPS CALCULATION
      // Bed Gap: difference between required care and current free beds
      let freeRelevantBeds = hospital.beds.icuFree;
      if (requiredBedType === 'ICU_CCU') {
        freeRelevantBeds = hospital.beds.ccuFree;
      }
      const bedGap = Math.max(0, 3 - freeRelevantBeds); // penalty if less than 3 buffer beds

      // Specialist Gap: 0 if specialist present and on-duty, 5 if off-duty/paging, 10 if none
      let specialistGap = 0;
      if (!hospital.specialistOnDuty) {
        specialistGap = 8;
      }

      // ER Load Gap: scaled from 0-10 based on erLoadPercent
      const erLoadMetric = (hospital.erLoadPercent / 10).toFixed(1);

      // 3. WEIGHTED SCORE CALCULATION
      // Score = w1*ETA + w2*BedGap + w3*SpecialistGap + w4*ERLoad
      const etaComponent = parseFloat((w1_eta * hospital.etaMinutes).toFixed(1));
      const bedComponent = parseFloat((w2_bedGap * bedGap).toFixed(1));
      const specComponent = parseFloat((w3_specialistGap * specialistGap).toFixed(1));
      const loadComponent = parseFloat((w4_erLoad * parseFloat(erLoadMetric)).toFixed(1));

      let totalScore = Math.round(etaComponent + bedComponent + specComponent + loadComponent);

      // If hard filter failed, impose prohibitive penalty so it sorts to bottom
      if (!isEligible) {
        totalScore += 200;
      }

      return {
        ...hospital,
        isEligible,
        hardFilterFailures,
        metrics: {
          eta: hospital.etaMinutes,
          bedGap,
          specialistGap,
          erLoadMetric: parseFloat(erLoadMetric),
        },
        breakdown: {
          etaComponent,
          bedComponent,
          specComponent,
          loadComponent,
        },
        totalScore,
      };
    });

    // Sort ascending by totalScore (lowest cost wins!)
    evaluated.sort((a, b) => a.totalScore - b.totalScore);

    return evaluated;
  }
}
