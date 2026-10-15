/**
 * Audio Chime Service - Web Audio API Trauma Alert Annunciator
 * Synthesizes an authentic two-tone ER emergency chime without external mp3 dependencies.
 */

export class AudioChimeService {
  constructor() {
    this.audioCtx = null;
    this.isMuted = false;
  }

  initContext() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
  }

  /**
   * Plays the two-tone hospital ER inbound emergency alert
   * Pitch: 880Hz (A5) followed by 659Hz (E5)
   */
  playEmergencyChime() {
    if (this.isMuted) return;

    try {
      this.initContext();
      if (!this.audioCtx) return;

      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const now = this.audioCtx.currentTime;

      // Tone 1: High alert (880Hz)
      const osc1 = this.audioCtx.createOscillator();
      const gain1 = this.audioCtx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, now);
      gain1.gain.setValueAtTime(0.2, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc1.connect(gain1);
      gain1.connect(this.audioCtx.destination);
      osc1.start(now);
      osc1.stop(now + 0.35);

      // Tone 2: Resolving pulse (659Hz)
      const osc2 = this.audioCtx.createOscillator();
      const gain2 = this.audioCtx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(659.25, now + 0.22);
      gain2.gain.setValueAtTime(0.25, now + 0.22);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
      osc2.connect(gain2);
      gain2.connect(this.audioCtx.destination);
      osc2.start(now + 0.22);
      osc2.stop(now + 0.7);
    } catch (e) {
      console.warn("PulseRoute: Audio chime playback bypassed:", e);
    }
  }

  /**
   * Heart rate beep (QRS sync click)
   */
  playQRSBeep() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.audioCtx || this.audioCtx.state === 'suspended') return;
      
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(950, now);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // ignore
    }
  }
}

export const chimeService = new AudioChimeService();
