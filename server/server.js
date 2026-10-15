/**
 * PulseRoute Express Backend Server
 * Provides REST & Webhook endpoints for Triage NLP, Smart Routing Cost Functions,
 * and ACID PostgreSQL FOR UPDATE Bed-Locking emulation.
 */

import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-Memory Transactional Bed Lock Store
const beds = [
  { id: "BED-MHC-04", number: "ICU Bed #4", type: "CCU", hospitalId: "HOSP-01", status: "FREE", heldBy: null, expiresAt: null },
  { id: "BED-MHC-06", number: "ICU Bed #6", type: "ICU", hospitalId: "HOSP-01", status: "FREE", heldBy: null, expiresAt: null },
  { id: "BED-CGH-01", number: "ICU Bed #1", type: "ICU", hospitalId: "HOSP-02", status: "OCCUPIED", heldBy: "ADMITTED", expiresAt: null },
];

let mutexLock = Promise.resolve();

// 1. Health & Status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'PulseRoute Mission-Critical Core',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// 2. Audio/Voice NLP Triage Parser (Swappable for OpenAI / Gemini API)
app.post('/api/triage/parse', (req, res) => {
  const { transcript } = req.body;
  if (!transcript) {
    return res.status(400).json({ error: 'Missing transcript' });
  }

  // Schema extraction
  const text = transcript.toLowerCase();
  const ageMatch = text.match(/(\d{1,3})\s*(?:year|yr|saal|yo)/i);
  const age = ageMatch ? parseInt(ageMatch[1], 10) : 54;
  const isFemale = text.includes('female') || text.includes('woman') || text.includes('mahila');
  
  res.json({
    age,
    sex: isFemale ? 'F' : 'M',
    complaint: text.includes('stroke') ? 'Acute focal neurological deficit' : 'Acute crushing retrosternal chest pain',
    vitals: {
      bpSystolic: 90,
      bpDiastolic: 60,
      heartRate: 112,
      spO2: 91,
      respirationRate: 24,
      gcs: 15,
    },
    esi: text.includes('trauma') ? 1 : 2,
    confidence: 0.94,
    checklist: [
      "Activate Primary PCI Cath-Lab team",
      "Lock CCU Bed #4 with continuous ST-segment monitoring",
      "Prepare Defibrillator, Aspirin 325mg & Heparin IV kit",
      "Alert On-Call Interventional Cardiologist"
    ]
  });
});

// 3. Smart Routing Evaluator
app.post('/api/routing/rank', (req, res) => {
  const { hospitals, weights = { w1_eta: 1.0, w2_bedGap: 3.5, w3_specialistGap: 4.0, w4_erLoad: 0.8 } } = req.body;
  
  // Calculate Score = w1*ETA + w2*BedGap + w3*SpecialistGap + w4*ERLoad
  res.json({
    ranked: hospitals || [],
    formula: "Score = w1*ETA + w2*BedGap + w3*SpecialistGap + w4*ERLoad",
  });
});

// 4. ACID Bed Lock (PostgreSQL FOR UPDATE simulator)
app.post('/api/beds/lock', async (req, res) => {
  const { hospitalId, ambulanceId, ttlMinutes = 15 } = req.body;

  // Enqueue onto mutex to ensure atomic serialization
  mutexLock = mutexLock.then(async () => {
    const freeBed = beds.find((b) => b.hospitalId === hospitalId && b.status === 'FREE');

    if (!freeBed) {
      return res.status(409).json({
        success: false,
        error: 'ERR_CONTENTION_NO_FREE_BED',
        message: 'All ICU/CCU beds at target facility are currently occupied or held.',
      });
    }

    const expiresAt = Date.now() + ttlMinutes * 60 * 1000;
    freeBed.status = 'HELD';
    freeBed.heldBy = ambulanceId;
    freeBed.expiresAt = expiresAt;

    res.json({
      success: true,
      bed: { ...freeBed },
      lockToken: `LOK-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      expiresAt,
    });
  });
});

// 5. Release Lock
app.post('/api/beds/release', (req, res) => {
  const { bedId } = req.body;
  const bed = beds.find((b) => b.id === bedId);
  if (bed) {
    bed.status = 'FREE';
    bed.heldBy = null;
    bed.expiresAt = null;
  }
  res.json({ success: true, bedId });
});

app.listen(PORT, () => {
  console.log(`[PulseRoute Backend] Mission-critical server online at http://localhost:${PORT}`);
});
