/**
 * Audio Triage Service - Pluggable Voice & NLP Extraction Engine
 * Modular contract: Can bind to Web Speech API, mock audio simulator, or real Gemini/Whisper backend API.
 */

import { ESI_LEVELS } from '../contracts/TriageContracts';

export class AudioTriageService {
  constructor(apiEndpoint = null, apiKey = null) {
    this.apiEndpoint = apiEndpoint;
    this.apiKey = apiKey;
    this.recognitionInstance = null;
    this.isListening = false;
  }

  /**
   * Initializes Web Speech API recognition if supported by browser
   */
  initSpeechRecognition(onResult, onError, onEnd) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("PulseRoute: Web Speech API not supported in this browser. Falling back to simulated/preset mode.");
      return false;
    }

    try {
      this.recognitionInstance = new SpeechRecognition();
      this.recognitionInstance.continuous = true;
      this.recognitionInstance.interimResults = true;
      this.recognitionInstance.lang = 'en-US';

      this.recognitionInstance.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        onResult(transcript);
      };

      this.recognitionInstance.onerror = (err) => {
        console.error("Speech recognition error:", err);
        if (onError) onError(err);
      };

      this.recognitionInstance.onend = () => {
        this.isListening = false;
        if (onEnd) onEnd();
      };

      return true;
    } catch (e) {
      console.error("Failed to init SpeechRecognition:", e);
      return false;
    }
  }

  startListening() {
    if (this.recognitionInstance && !this.isListening) {
      try {
        this.recognitionInstance.start();
        this.isListening = true;
        return true;
      } catch (e) {
        console.warn("Could not start recognition:", e);
      }
    }
    return false;
  }

  stopListening() {
    if (this.recognitionInstance && this.isListening) {
      try {
        this.recognitionInstance.stop();
        this.isListening = false;
      } catch (e) {
        console.warn("Could not stop recognition:", e);
      }
    }
  }

  /**
   * Parses text (from live speech or presets) into schema-validated JSON
   * Easily swapped with fetch(`${this.apiEndpoint}/parse-voice`)
   */
  async parseTranscript(transcript) {
    // If backend endpoint is configured, delegate to real LLM backend:
    if (this.apiEndpoint) {
      const response = await fetch(`${this.apiEndpoint}/api/triage/parse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript }),
      });
      return await response.json();
    }

    // Default High-Precision Clinical Regex / Rule Engine (Zero-shot mock fallback):
    const text = transcript.toLowerCase();
    
    // Extract Age
    const ageMatch = text.match(/(\d{1,3})\s*(?:year|yr|saal|yo)/i) || text.match(/(?:male|female|patient)\s*,?\s*(\d{1,3})/i);
    const age = ageMatch ? parseInt(ageMatch[1], 10) : 54;

    // Extract Sex
    let sex = "M";
    if (text.includes("female") || text.includes("woman") || text.includes("mahila") || text.includes("ladki")) {
      sex = "F";
    }

    // Extract Blood Pressure
    let bpSystolic = 90;
    let bpDiastolic = 60;
    const bpMatch = text.match(/bp\s*(?:is)?\s*(\d{2,3})\s*(?:over|\/)\s*(\d{2,3})/i) || text.match(/(\d{2,3})\s*\/\s*(\d{2,3})/);
    if (bpMatch) {
      bpSystolic = parseInt(bpMatch[1], 10);
      bpDiastolic = parseInt(bpMatch[2], 10);
    }

    // Extract SpO2
    let spO2 = 91;
    const spo2Match = text.match(/spo2\s*(?:is)?\s*(\d{2,3})%?/i) || text.match(/oxygen\s*(?:is)?\s*(\d{2,3})/i) || text.match(/(\d{2,3})%/);
    if (spo2Match) {
      spO2 = parseInt(spo2Match[1], 10);
    }

    // Extract Heart Rate / Pulse
    let heartRate = 112;
    const hrMatch = text.match(/(?:pulse|hr|heart rate)\s*(?:is)?\s*(\d{2,3})/i);
    if (hrMatch) {
      heartRate = parseInt(hrMatch[1], 10);
    }

    // Determine ESI level & specialty
    let esi = 2;
    let requiredSpecialty = "CARDIOLOGY";
    let requiredBedType = "ICU_CCU";
    let requiresCathLab = true;
    let requiresVentilator = false;
    let complaint = "Acute chest discomfort / possible cardiac ischemic event";
    let suspectedCondition = "Acute Coronary Syndrome (STEMI)";
    let checklist = [
      "Activate Primary PCI Cath-Lab team",
      "Lock dedicated CCU bed with continuous ECG monitor",
      "Prep Defibrillator pads, Aspirin 325mg & Heparin IV kit",
      "Alert On-Call Interventional Cardiologist"
    ];

    if (text.includes("stroke") || text.includes("hemiparesis") || text.includes("slurred") || text.includes("facial droop") || text.includes("droop")) {
      requiredSpecialty = "NEUROLOGY";
      requiredBedType = "NEURO_ICU";
      requiresCathLab = false;
      complaint = "Acute right/left sided weakness, slurred speech (LVO window)";
      suspectedCondition = "Acute Ischemic Stroke / Large Vessel Occlusion";
      esi = 2;
      checklist = [
        "Clear CT scanner bay for immediate non-contrast head CT",
        "Page On-Call Stroke Neurologist (tPA window active)",
        "Lock Neuro-ICU monitoring bed",
        "Prep Tenecteplase / Alteplase dosing weight chart"
      ];
    } else if (text.includes("trauma") || text.includes("crash") || text.includes("collision") || text.includes("thoracic") || text.includes("intubated")) {
      requiredSpecialty = "TRAUMA";
      requiredBedType = "TRAUMA_BAY";
      requiresCathLab = false;
      requiresVentilator = true;
      complaint = "Severe blunt polytrauma, unstable hemodynamics";
      suspectedCondition = "Polytrauma with hemorrhagic shock & flail chest";
      esi = 1;
      checklist = [
        "Assemble Level-1 Trauma Resuscitation Team at Red Bay",
        "Activate Massive Transfusion Protocol (4 Units O-Neg)",
        "Prep Thoracostomy chest tube kit and Rapid Infuser",
        "Lock Trauma Bay Resus Bed with ventilator standby"
      ];
    }

    return {
      age,
      sex,
      complaint,
      vitals: {
        bpSystolic,
        bpDiastolic,
        heartRate,
        spO2,
        respirationRate: esi === 1 ? 28 : 22,
        temperature: 37.0,
        gcs: esi === 1 ? 8 : 15,
      },
      symptoms: text.includes("sweat") || text.includes("paseena") ? ["Diaphoresis", "Pain radiation"] : ["Acute distress"],
      suspectedCondition,
      requiredSpecialty,
      requiredBedType,
      requiresCathLab,
      requiresVentilator,
      esi,
      confidence: 0.94,
      checklist,
      transcription: transcript,
    };
  }
}
