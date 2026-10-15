/**
 * Initial Bed Inventory across hospitals
 * Features explicit row IDs, versions, and lock lease tracking for ACID simulation.
 */

import { BED_STATUS } from '../contracts/BedLockContracts';

export const INITIAL_BED_INVENTORY = [
  // Metro Heart Centre Beds
  { id: "BED-MHC-01", number: "CCU Bed #1", type: "CCU", hospitalId: "HOSP-01", status: BED_STATUS.OCCUPIED, heldBy: "ADMITTED", lockedAt: null, expiresAt: null, patientId: "PT-9402" },
  { id: "BED-MHC-02", number: "CCU Bed #2", type: "CCU", hospitalId: "HOSP-01", status: BED_STATUS.OCCUPIED, heldBy: "ADMITTED", lockedAt: null, expiresAt: null, patientId: "PT-1182" },
  { id: "BED-MHC-03", number: "CCU Bed #3", type: "CCU", hospitalId: "HOSP-01", status: BED_STATUS.OCCUPIED, heldBy: "ADMITTED", lockedAt: null, expiresAt: null, patientId: "PT-4429" },
  { id: "BED-MHC-04", number: "ICU Bed #4", type: "CCU", hospitalId: "HOSP-01", status: BED_STATUS.FREE, heldBy: null, lockedAt: null, expiresAt: null, patientId: null }, // Primary lock candidate!
  { id: "BED-MHC-05", number: "CCU Bed #5", type: "CCU", hospitalId: "HOSP-01", status: BED_STATUS.OCCUPIED, heldBy: "ADMITTED", lockedAt: null, expiresAt: null, patientId: "PT-6612" },
  { id: "BED-MHC-06", number: "ICU Bed #6", type: "ICU", hospitalId: "HOSP-01", status: BED_STATUS.FREE, heldBy: null, lockedAt: null, expiresAt: null, patientId: null },
  { id: "BED-MHC-07", number: "ICU Bed #7", type: "ICU", hospitalId: "HOSP-01", status: BED_STATUS.FREE, heldBy: null, lockedAt: null, expiresAt: null, patientId: null },
  
  // City General Beds (All critical beds occupied / diversion)
  { id: "BED-CGH-01", number: "ICU Bed #1", type: "ICU", hospitalId: "HOSP-02", status: BED_STATUS.OCCUPIED, heldBy: "ADMITTED", lockedAt: null, expiresAt: null, patientId: "PT-3301" },
  { id: "BED-CGH-02", number: "ICU Bed #2", type: "ICU", hospitalId: "HOSP-02", status: BED_STATUS.OCCUPIED, heldBy: "ADMITTED", lockedAt: null, expiresAt: null, patientId: "PT-3302" },
  { id: "BED-CGH-03", number: "CCU Bed #1", type: "CCU", hospitalId: "HOSP-02", status: BED_STATUS.OCCUPIED, heldBy: "ADMITTED", lockedAt: null, expiresAt: null, patientId: "PT-3303" },

  // District Apex Beds
  { id: "BED-DAT-01", number: "Trauma Resus Bay #1", type: "TRAUMA_BAY", hospitalId: "HOSP-03", status: BED_STATUS.FREE, heldBy: null, lockedAt: null, expiresAt: null, patientId: null },
  { id: "BED-DAT-02", number: "Neuro-ICU Bed #2", type: "NEURO_ICU", hospitalId: "HOSP-03", status: BED_STATUS.FREE, heldBy: null, lockedAt: null, expiresAt: null, patientId: null },
  { id: "BED-DAT-03", number: "ICU Bed #3", type: "ICU", hospitalId: "HOSP-03", status: BED_STATUS.FREE, heldBy: null, lockedAt: null, expiresAt: null, patientId: null },
];
