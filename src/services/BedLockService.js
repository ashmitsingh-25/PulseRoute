/**
 * Bed Lock Service - ACID Pessimistic Row-Level Lock Simulator
 * Simulates PostgreSQL SELECT ... FOR UPDATE transactions with TTL expiry.
 */

import { BED_STATUS, DEFAULT_LOCK_TTL_SECONDS } from '../contracts/BedLockContracts';
import { INITIAL_BED_INVENTORY } from '../data/initialBedInventory';

export class BedLockService {
  constructor(initialBeds = INITIAL_BED_INVENTORY) {
    this.beds = JSON.parse(JSON.stringify(initialBeds));
    this.transactionLogs = [];
    this.activeLocks = new Map(); // bedId -> timeout handle
    this.mutexQueue = Promise.resolve(); // guarantees transaction serialization
  }

  getBedsForHospital(hospitalId) {
    return this.beds.filter((b) => b.hospitalId === hospitalId);
  }

  getAllBeds() {
    return this.beds;
  }

  logTransaction(entry) {
    const logItem = {
      id: `TX-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 }),
      ...entry,
    };
    this.transactionLogs.unshift(logItem);
    if (this.transactionLogs.length > 50) {
      this.transactionLogs.pop();
    }
    return logItem;
  }

  /**
   * Executes atomic lock with simulated PostgreSQL 'SELECT ... FOR UPDATE'
   */
  async acquireLock(hospitalId, bedType, ambulanceId, ttlSeconds = DEFAULT_LOCK_TTL_SECONDS) {
    // Chain onto mutex queue to guarantee atomic execution (row-level serialization)
    return new Promise((resolve) => {
      this.mutexQueue = this.mutexQueue.then(async () => {
        const txStart = performance.now();
        
        this.logTransaction({
          type: "BEGIN_TRANSACTION",
          ambulanceId,
          hospitalId,
          sql: `BEGIN; -- Isolation Level: SERIALIZABLE / READ COMMITTED`,
          status: "PENDING",
        });

        // Simulate network/query latency (50-100ms)
        await new Promise((r) => setTimeout(r, 60));

        // SELECT * FROM icu_beds WHERE hospital_id = :h AND status = 'FREE' LIMIT 1 FOR UPDATE;
        this.logTransaction({
          type: "ACQUIRE_ROW_LOCK",
          ambulanceId,
          hospitalId,
          sql: `SELECT * FROM icu_beds WHERE hospital_id = '${hospitalId}' AND status = 'FREE' LIMIT 1 FOR UPDATE;`,
          status: "ROW_LOCKED",
        });

        // Find candidate bed
        const bedIndex = this.beds.findIndex(
          (b) => b.hospitalId === hospitalId && b.status === BED_STATUS.FREE
        );

        if (bedIndex === -1) {
          // No free bed! Rollback
          this.logTransaction({
            type: "ROLLBACK",
            ambulanceId,
            hospitalId,
            sql: `ROLLBACK; -- 0 rows returned under FOR UPDATE`,
            status: "CONFLICT_FAILED",
            error: "ERR_NO_FREE_BED_AVAILABLE",
          });
          resolve({
            success: false,
            error: "ERR_NO_FREE_BED",
            message: `Contention conflict: No free ${bedType} beds available at hospital ${hospitalId}.`,
            hospitalId,
          });
          return;
        }

        const bed = this.beds[bedIndex];
        const now = Date.now();
        const expiresAt = now + ttlSeconds * 1000;
        const lockToken = `LOK-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

        // UPDATE icu_beds SET status='HELD', held_by=:amb, expires_at = now()+'15 min';
        bed.status = BED_STATUS.HELD;
        bed.heldBy = ambulanceId;
        bed.lockedAt = now;
        bed.expiresAt = expiresAt;
        bed.lockToken = lockToken;
        bed.version += 1;

        // COMMIT;
        const duration = (performance.now() - txStart).toFixed(2);
        this.logTransaction({
          type: "COMMIT",
          ambulanceId,
          hospitalId,
          bedId: bed.id,
          bedNumber: bed.number,
          sql: `UPDATE icu_beds SET status='HELD', held_by='${ambulanceId}', expires_at=NOW() + INTERVAL '${ttlSeconds / 60} MIN' WHERE id='${bed.id}'; COMMIT;`,
          status: "LOCKED_SUCCESS",
          durationMs: duration,
        });

        // Setup auto-release timer for TTL
        if (this.activeLocks.has(bed.id)) {
          clearTimeout(this.activeLocks.get(bed.id));
        }
        const timer = setTimeout(() => {
          this.releaseLock(bed.id, "TTL_EXPIRED");
        }, ttlSeconds * 1000);
        this.activeLocks.set(bed.id, timer);

        resolve({
          success: true,
          bed: { ...bed },
          lockToken,
          expiresAt,
          hospitalId,
          ambulanceId,
        });
      });
    });
  }

  /**
   * Release hold on bed
   */
  async releaseLock(bedId, reason = "PATIENT_ADMITTED_OR_CANCELLED") {
    const bed = this.beds.find((b) => b.id === bedId);
    if (!bed) return false;

    if (this.activeLocks.has(bedId)) {
      clearTimeout(this.activeLocks.get(bedId));
      this.activeLocks.delete(bedId);
    }

    const previousHolder = bed.heldBy;
    bed.status = BED_STATUS.FREE;
    bed.heldBy = null;
    bed.lockedAt = null;
    bed.expiresAt = null;
    bed.lockToken = null;
    bed.version += 1;

    this.logTransaction({
      type: "RELEASE_LOCK",
      ambulanceId: previousHolder,
      bedId,
      bedNumber: bed.number,
      sql: `UPDATE icu_beds SET status='FREE', held_by=NULL WHERE id='${bedId}'; COMMIT;`,
      status: "RELEASED",
      reason,
    });

    return true;
  }

  /**
   * Extends lock hold by additional minutes if ambulance encounters traffic
   */
  async extendLock(bedId, additionalSeconds = 5 * 60) {
    const bed = this.beds.find((b) => b.id === bedId);
    if (!bed || bed.status !== BED_STATUS.HELD) return false;

    bed.expiresAt += additionalSeconds * 1000;

    // Reset timer
    if (this.activeLocks.has(bedId)) {
      clearTimeout(this.activeLocks.get(bedId));
    }
    const remainingTime = Math.max(0, bed.expiresAt - Date.now());
    const timer = setTimeout(() => {
      this.releaseLock(bed.id, "TTL_EXPIRED");
    }, remainingTime);
    this.activeLocks.set(bed.id, timer);

    this.logTransaction({
      type: "EXTEND_LOCK",
      ambulanceId: bed.heldBy,
      bedId,
      bedNumber: bed.number,
      sql: `UPDATE icu_beds SET expires_at=expires_at + INTERVAL '${additionalSeconds / 60} MIN' WHERE id='${bedId}'; COMMIT;`,
      status: "EXTENDED",
    });

    return true;
  }

  /**
   * Simulates concurrent lock contention between Ambulance A and Ambulance B (Slide 6 demo)
   */
  async simulateRaceCondition(hospitalId = "HOSP-01", ambA = "AMB-108 (Alpha)", ambB = "AMB-204 (Bravo)") {
    // Ensure only 1 free bed is left for this experiment
    const targetBed = this.beds.find((b) => b.hospitalId === hospitalId && b.status === BED_STATUS.FREE);
    if (!targetBed) {
      // Free one up for the demo
      const occBed = this.beds.find((b) => b.hospitalId === hospitalId);
      if (occBed) occBed.status = BED_STATUS.FREE;
    }

    // Fire both requests nearly simultaneously (5ms apart)
    const promiseA = this.acquireLock(hospitalId, "ICU", ambA);
    await new Promise((r) => setTimeout(r, 8)); // 8ms jitter
    const promiseB = this.acquireLock(hospitalId, "ICU", ambB);

    const [resultA, resultB] = await Promise.all([promiseA, promiseB]);

    return {
      ambA: { id: ambA, ...resultA },
      ambB: { id: ambB, ...resultB },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * 1,000 Concurrent lock stress test (Slide 8 validation)
   */
  async runConcurrentStressTest(totalRequests = 1000) {
    let successCount = 0;
    let collisionCount = 0;
    let doubleBookingErrors = 0;

    // Snapshot current state
    const originalBeds = JSON.parse(JSON.stringify(this.beds));
    
    // Create single test hospital with exactly 5 free beds
    const testBeds = Array.from({ length: 5 }, (_, i) => ({
      id: `STRESS-BED-${i + 1}`,
      number: `Stress Bed #${i + 1}`,
      type: 'ICU',
      hospitalId: 'TEST-HOSP',
      status: BED_STATUS.FREE,
      heldBy: null,
      version: 1,
    }));

    this.beds.push(...testBeds);

    const lockOwners = new Map();

    const tasks = Array.from({ length: totalRequests }, async (_, i) => {
      const ambId = `AMB-BENCH-${i + 1}`;
      const res = await this.acquireLock('TEST-HOSP', 'ICU', ambId, 30);
      if (res.success) {
        successCount++;
        if (lockOwners.has(res.bed.id)) {
          doubleBookingErrors++; // CRITICAL ANOMALY DETECTED!
        } else {
          lockOwners.set(res.bed.id, ambId);
        }
      } else {
        collisionCount++;
      }
    });

    await Promise.all(tasks);

    // Clean up test beds
    this.beds = this.beds.filter((b) => b.hospitalId !== 'TEST-HOSP');

    return {
      totalRequests,
      availableBeds: 5,
      successfulLocks: successCount, // Must equal 5!
      safelySerializedConflicts: collisionCount, // Must equal 995!
      doubleBookingsDetected: doubleBookingErrors, // Must strictly be 0!
      acidCompliance: doubleBookingErrors === 0 && successCount === 5,
    };
  }
}
