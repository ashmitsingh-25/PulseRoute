/**
 * Bed Lock Contracts - Pessimistic Row-Level Lock State Machine & ACID Transaction Schema
 * Mimics:
 *   BEGIN;
 *   SELECT * FROM icu_beds WHERE hospital_id = :h AND status = 'FREE' LIMIT 1 FOR UPDATE;
 *   UPDATE icu_beds SET status='HELD', held_by=:amb, expires_at = now()+'15 min';
 *   COMMIT;
 */

export const BED_STATUS = {
  FREE: "FREE",
  HELD: "HELD",
  OCCUPIED: "OCCUPIED",
  MAINTENANCE: "MAINTENANCE",
};

export const DEFAULT_LOCK_TTL_SECONDS = 15 * 60; // 15 minutes TTL

export const createBedModel = (id, number, type, hospitalId, status = BED_STATUS.FREE) => ({
  id,
  number,
  type, // 'ICU' | 'CCU' | 'TRAUMA_BAY' | 'PICU'
  hospitalId,
  status,
  heldBy: null, // ambulanceId e.g. 'AMB-108'
  lockedAt: null,
  expiresAt: null,
  lockToken: null,
  version: 1, // for optimistic verification / pessimistic lease tracking
});
