# PulseRoute // Modern Clinical Emergency Telemetry & Bed Allocation System

> **Real-world hospital & EMS emergency pre-arrival system with intelligent routing and atomic bed reservation.**

---

## 1. Overview & Human Medical Aesthetic

PulseRoute has been overhauled into a **real-world modern clinical application** (inspired by Epic EHR, Linear, and Apple Health):
- **Color Theme**: Clean Medical Light Mode
  - Background: Crisp off-white & neutral light gray (`#F8FAFC` / `#F1F5F9`).
  - Cards & Surfaces: Pure white (`#FFFFFF`) with thin borders (`#E2E8F0`) and subtle modern drop-shadows.
  - Typography: Modern clean sans-serif (`Inter`) with regular sentence casing. **No all-caps monospace jargon, no `//` slashes, no code variable names.**
  - Status Badges: Soft rose red (`bg-red-50 text-red-700`), soft emerald (`bg-emerald-50 text-emerald-700`), and cobalt blue (`bg-blue-50 text-blue-700`).
- **Clinical Clarity**: Displays only medical and operational facts—patient age, vitals, selected hospital, bed status, and arrival countdown.

---

## 2. Navigation & Workflow Architecture

The application is structured into clean, dedicated views via a top segmented navigation bar:

1. **Ambulance (Paramedic View)**:
   A focused, calm 3-step wizard:
   - **Step 1: Voice Triage**:
     - Large microphone button: *"Hold or Tap to Record Triage Note"* with soft pulse animation.
     - Quick scenario pills: `Cardio Emergency (STEMI)`, `Acute Stroke`, `Severe Trauma`, `Hinglish Scenario`.
     - Patient Summary card with 4 Big Metric Chips: **Heart Rate (112 bpm)**, **Blood Pressure (90/60)**, **SpO2 (91%)**, and **ESI Level (Level 2 - Emergent)**.
     - Clear human complaint summary: *"54-year-old male with severe chest pain radiating to left arm."*
     - Button: **"Find Best Hospitals for Patient →"**
   - **Step 2: Hospital Selection & Bed Hold**:
     - **Hospital A (Metro Heart Centre)** — **Recommended Choice (Match 96/100)**: ETA 14 mins • Cath-Lab On-Call & Ready • CCU Beds Available.
     - **Hospital B (City General Hospital)** — **Not Suitable**: ETA 7 mins • ⚠️ *No Cardiology Team on Duty* (geographically closer, but disqualified because it cannot treat STEMI).
     - **Hospital C (District Apex Trauma)**: ETA 19 mins • Level 1 Trauma.
     - Prominent primary action button: **"Reserve Bed & Dispatch Live Telemetry"**
   - **Step 3: En Route HUD**:
     - Clean GPS destination card: `Estimated Arrival: 14 mins to Metro Heart Centre` (with route progress bar).
     - Big reassurance banner: `Bed #4 Reserved & Locked (14:48 remaining)`.
     - Live ambulance telemetry strip with Lead II ECG monitor and demo vitals simulator.

2. **Hospital ER (Receiving Bay)**:
   A calm, spacious operations dashboard for the emergency department:
   - **Priority Inbound Emergency Banner**: Soft red alert card displaying Ambulance #108, patient condition, ESI Level 2, and live arrival countdown.
   - **Patient Vitals & Lead Monitor**: 4 large vital tiles (`HR 112`, `BP 90/60`, `SpO2 91%`, `Resp Rate 24`) and continuous Lead II ECG rhythm strip.
   - **Bed Allocation Tile**: Clean 6-bed visual grid where **Bed #4** highlights in amber with a lock badge (`Reserved for Inbound Amb #108`).
   - **Pre-Arrival Checklist**: Interactive clinical checkboxes (Alert Cath-Lab, Prep Bed #4, Ready IV Heparin & Defibrillator).

3. **Side-by-Side Presentation Mode**:
   - Split view specifically engineered for live pitch presentations and hackathon judging.
   - Paramedic 3-step wizard on the left; Hospital ER receiving dashboard on the right.
   - Instant synchronization: dispatching on the left immediately triggers the ER alert, bed reservation, and live ECG streaming on the right.

---

## 3. Running Locally

```bash
# Frontend development server (Port 5173)
npm run dev

# Optional Node/Express backend (Port 5000)
npm run server
```
