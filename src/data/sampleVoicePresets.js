/**
 * Real-world Emergency Voice Vignettes for Hands-Free Paramedic Simulation
 * Includes standard clinical notes and Hindi/Hinglish speech transcripts.
 */

export const VOICE_PRESETS = [
  {
    id: "STEMI_CARDIAC",
    title: "Cardiac - Acute STEMI (Slide 4 Spec)",
    language: "en-US",
    tag: "CARDIO - CRITICAL",
    color: "#E53935",
    speechText: "Male, 54, crushing chest pain radiating to left arm, BP 90 over 60, SpO2 91%, diaphoresis, acute distress, suspected inferior STEMI.",
    parsedData: {
      age: 54,
      sex: "M",
      complaint: "Crushing retrosternal chest pain radiating to left arm",
      vitals: {
        bpSystolic: 90,
        bpDiastolic: 60,
        heartRate: 112,
        spO2: 91,
        respirationRate: 24,
        temperature: 37.0,
        gcs: 15,
      },
      symptoms: ["Severe diaphoresis", "Left shoulder radiation", "Nausea", "Pale skin"],
      suspectedCondition: "Acute Inferior STEMI / Cardiogenic Shock Threat",
      requiredSpecialty: "CARDIOLOGY",
      requiredBedType: "ICU_CCU",
      requiresCathLab: true,
      requiresVentilator: false,
      esi: 2,
      confidence: 0.94,
      lowConfidenceFields: [],
      checklist: [
        "Activate Primary PCI Cath-Lab team (Page Interventionalist)",
        "Lock dedicated CCU bed with continuous ST-segment monitoring",
        "Prepare Defibrillator pads, 300mg Aspirin, 600mg Clopidogrel",
        "Prep Heparin IV infusion & dual-bore IV access"
      ]
    }
  },
  {
    id: "STROKE_NEURO",
    title: "Stroke - Acute LVO (Within Thrombolysis Window)",
    language: "en-US",
    tag: "NEURO - FAST TRACK",
    color: "#FB8C00",
    speechText: "Female, 68, sudden onset right-sided hemiparesis, severe slurred speech, facial droop, symptom onset 38 minutes ago, BP 178 over 102, pulse 88.",
    parsedData: {
      age: 68,
      sex: "F",
      complaint: "Acute right-sided hemiparesis and dense aphasia",
      vitals: {
        bpSystolic: 178,
        bpDiastolic: 102,
        heartRate: 88,
        spO2: 96,
        respirationRate: 18,
        temperature: 36.8,
        gcs: 12,
      },
      symptoms: ["Right facial droop", "Right arm/leg weakness (0/5)", "Dysarthria", "NIHSS ~16"],
      suspectedCondition: "Acute Ischemic Stroke (LVO suspected) - Golden Hour Window",
      requiredSpecialty: "NEUROLOGY",
      requiredBedType: "NEURO_ICU",
      requiresCathLab: false,
      requiresVentilator: false,
      esi: 2,
      confidence: 0.96,
      lowConfidenceFields: [],
      checklist: [
        "Direct-to-CT Stroke Protocol (Clear CT scanner bay)",
        "Page On-Call Stroke Neurologist (tPA / Tenecteplase prep)",
        "Alert Neuro-Interventional team for potential thrombectomy",
        "Reserve Neuro-Intensive Care Bed"
      ]
    }
  },
  {
    id: "TRAUMA_MVC",
    title: "Severe Polytrauma - Highway MVC",
    language: "en-US",
    tag: "TRAUMA - ESI 1",
    color: "#E53935",
    speechText: "Male, 28, unrestrained passenger high speed collision, blunt thoracic trauma, paradoxical chest wall movement, BP 82 over 48, pulse 138, SpO2 86%, intubated en route.",
    parsedData: {
      age: 28,
      sex: "M",
      complaint: "Blunt polytrauma, flail chest, hemorrhagic shock",
      vitals: {
        bpSystolic: 82,
        bpDiastolic: 48,
        heartRate: 138,
        spO2: 86,
        respirationRate: 30,
        temperature: 35.8,
        gcs: 7,
      },
      symptoms: ["Paradoxical chest wall movement", "Severe tachycardia", "Cold clammy extremities", "Tracheal deviation right"],
      suspectedCondition: "Tension Pneumothorax + Massive Hemothorax / Hemorrhagic Shock",
      requiredSpecialty: "TRAUMA",
      requiredBedType: "TRAUMA_BAY",
      requiresCathLab: false,
      requiresVentilator: true,
      esi: 1,
      confidence: 0.91,
      lowConfidenceFields: ["gcs"],
      checklist: [
        "Assemble Level-1 Trauma Resuscitation Team at Red Bay",
        "Activate Massive Transfusion Protocol (4 Units O-Neg on standby)",
        "Prep Thoracostomy chest tube tray and Rapid Infuser",
        "Lock Surgical ICU Bed with mechanical ventilator standby"
      ]
    }
  },
  {
    id: "HINGLISH_CARDIAC",
    title: "Hindi / Hinglish Cardiac Emergency (Slide 4 Spec)",
    language: "hi-IN",
    tag: "HINGLISH - CARDIAC",
    color: "#E53935",
    speechText: "54 saal ka male, chest mein bahot tez pain left shoulder tak, BP 90 over 60, SpO2 91%, paseena aa raha hai, urgent CCU bed aur cath lab chahiye.",
    parsedData: {
      age: 54,
      sex: "M",
      complaint: "Severe crushing retrosternal pain with left arm radiation (Reported in Hinglish)",
      vitals: {
        bpSystolic: 90,
        bpDiastolic: 60,
        heartRate: 114,
        spO2: 91,
        respirationRate: 24,
        temperature: 37.1,
        gcs: 15,
      },
      symptoms: ["Bhari paseena (Profuse diaphoresis)", "Left shoulder pain", "Ghabrahat"],
      suspectedCondition: "Acute Coronary Syndrome / Inferior Wall MI",
      requiredSpecialty: "CARDIOLOGY",
      requiredBedType: "ICU_CCU",
      requiresCathLab: true,
      requiresVentilator: false,
      esi: 2,
      confidence: 0.93,
      lowConfidenceFields: [],
      checklist: [
        "Primary PCI Cath-Lab activation",
        "Lock CCU Bed #4 at Metro Heart Centre",
        "Cardiologist standby with emergency angioplasty kit",
        "Pre-arrival sublingual nitroglycerin & antiplatelet load"
      ]
    }
  }
];
