/**
 * Telemetry Service - Real-Time Telemetry Stream & ECG Waveform Engine
 * Uses BroadcastChannel / EventEmitter for sub-10ms inter-component or inter-tab sync.
 */

import { TELEMETRY_EVENTS, computeClinicalMetrics } from '../contracts/TelemetryContracts';

export class TelemetryService {
  constructor() {
    this.listeners = new Map();
    this.broadcastChannel = null;

    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.broadcastChannel = new BroadcastChannel('pulseroute_telemetry_bus');
        this.broadcastChannel.onmessage = (event) => {
          const { type, payload } = event.data;
          this.emitLocal(type, payload);
        };
      } catch (e) {
        console.warn("BroadcastChannel not supported:", e);
      }
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  emitLocal(event, payload) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach((cb) => {
        try {
          cb(payload);
        } catch (err) {
          console.error("Error in telemetry listener:", err);
        }
      });
    }
  }

  emit(event, payload) {
    this.emitLocal(event, payload);
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage({ type: event, payload });
      } catch (e) {
        // ignore
      }
    }
  }

  /**
   * Mathematically generates Lead II ECG voltage point at time t (normalized cycle 0 to 1)
   * Simulates P wave, PR segment, QRS complex, ST segment, T wave.
   */
  static getECGSample(phase) {
    // phase: 0.0 to 1.0 representing one cardiac cycle
    let y = 0;

    // Baseline drift
    y += Math.sin(phase * Math.PI * 2 * 0.1) * 0.02;

    // P Wave: 0.10 - 0.20
    if (phase >= 0.10 && phase < 0.20) {
      const p = (phase - 0.10) / 0.10;
      y += 0.15 * Math.sin(p * Math.PI);
    }
    // Q Wave: 0.28 - 0.31
    else if (phase >= 0.28 && phase < 0.31) {
      const q = (phase - 0.28) / 0.03;
      y -= 0.15 * Math.sin(q * Math.PI);
    }
    // R Wave (Tall Spike): 0.31 - 0.37
    else if (phase >= 0.31 && phase < 0.37) {
      const r = (phase - 0.31) / 0.06;
      y += 1.35 * Math.sin(r * Math.PI);
    }
    // S Wave (Deep valley): 0.37 - 0.41
    else if (phase >= 0.37 && phase < 0.41) {
      const s = (phase - 0.37) / 0.04;
      y -= 0.32 * Math.sin(s * Math.PI);
    }
    // ST Elevation (indicates STEMI!): 0.41 - 0.52
    else if (phase >= 0.41 && phase < 0.52) {
      const st = (phase - 0.41) / 0.11;
      // High ST segment elevation characteristic of acute infarction
      y += 0.22 + 0.05 * Math.sin(st * Math.PI);
    }
    // T Wave: 0.52 - 0.68
    else if (phase >= 0.52 && phase < 0.68) {
      const t = (phase - 0.52) / 0.16;
      y += 0.38 * Math.sin(t * Math.PI);
    }

    // High frequency noise / muscle tremor artifact
    y += (Math.random() - 0.5) * 0.03;

    return y;
  }

  /**
   * Plethysmograph (SpO2) sample generator
   */
  static getPlethSample(phase) {
    if (phase < 0.25) {
      return Math.sin((phase / 0.25) * (Math.PI / 2));
    } else if (phase < 0.5) {
      return Math.cos(((phase - 0.25) / 0.25) * (Math.PI / 4));
    } else if (phase < 0.65) {
      // Dicrotic notch
      return 0.7 + 0.1 * Math.sin(((phase - 0.5) / 0.15) * Math.PI);
    } else {
      return 0.7 * Math.cos(((phase - 0.65) / 0.35) * (Math.PI / 2));
    }
  }
}

export const telemetryService = new TelemetryService();
