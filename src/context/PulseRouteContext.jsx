import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { createEmptyTriageCard } from '../contracts/TriageContracts';
import { DEFAULT_ROUTING_WEIGHTS } from '../contracts/RoutingContracts';
import { SAMPLE_HOSPITALS } from '../data/sampleHospitals';
import { VOICE_PRESETS } from '../data/sampleVoicePresets';
import { AudioTriageService } from '../services/AudioTriageService';
import { RoutingEngine } from '../services/RoutingEngine';
import { BedLockService } from '../services/BedLockService';
import { telemetryService } from '../services/TelemetryService';
import { chimeService } from '../services/AudioChimeService';
import { TELEMETRY_EVENTS, computeClinicalMetrics } from '../contracts/TelemetryContracts';

const PulseRouteContext = createContext(null);

export const PulseRouteProvider = ({ children }) => {
  // Service Instances (Singleton Dependency Injection)
  const audioServiceRef = useRef(new AudioTriageService());
  const routingEngineRef = useRef(new RoutingEngine(DEFAULT_ROUTING_WEIGHTS));
  const bedLockServiceRef = useRef(new BedLockService());

  // View Mode: 'split' | 'ambulance' | 'er'
  const [viewMode, setViewMode] = useState('split');
  const [audioMuted, setAudioMuted] = useState(false);

  // Paramedic Wizard Step: 1 (Voice Triage), 2 (Hospital Selection), 3 (En Route HUD)
  const [paramedicStep, setParamedicStep] = useState(1);

  // Active Vehicle
  const [activeAmbulanceId, setActiveAmbulanceId] = useState('AMB-108');

  // Patient / Triage State
  const [patientCard, setPatientCard] = useState(createEmptyTriageCard());
  const [selectedPresetId, setSelectedPresetId] = useState(VOICE_PRESETS[0].id);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState(VOICE_PRESETS[0].speechText);

  // Hospitals & Smart Routing
  const [hospitals, setHospitals] = useState(SAMPLE_HOSPITALS);
  const [rankedHospitals, setRankedHospitals] = useState([]);
  const [selectedHospitalId, setSelectedHospitalId] = useState(SAMPLE_HOSPITALS[0].id);

  // Bed Locking State
  const [lockedBed, setLockedBed] = useState(null);
  const [bedLockTimeRemaining, setBedLockTimeRemaining] = useState(0); // in seconds
  const [isLockingInProgress, setIsLockingInProgress] = useState(false);
  const [transactionLogs, setTransactionLogs] = useState([]);

  // Telemetry & En Route Stream
  const [isDispatched, setIsDispatched] = useState(false);
  const [isStreamingTelemetry, setIsStreamingTelemetry] = useState(false);
  const [currentEtaMinutes, setCurrentEtaMinutes] = useState(14);
  const [distanceRemainingKm, setDistanceRemainingKm] = useState(8.4);
  const [liveVitals, setLiveVitals] = useState({ ...patientCard.vitals });
  const [clinicalMetrics, setClinicalMetrics] = useState(computeClinicalMetrics(patientCard.vitals));

  // ER Command Center Alert State
  const [inboundEmergencyActive, setInboundEmergencyActive] = useState(false);
  const [erFlashAlert, setErFlashAlert] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});

  // FHIR Drawer modal
  const [showFhirModal, setShowFhirModal] = useState(false);
  // Race condition acid modal
  const [showAcidModal, setShowAcidModal] = useState(false);

  // Update clinical metrics whenever vitals change
  useEffect(() => {
    setClinicalMetrics(computeClinicalMetrics(liveVitals));
  }, [liveVitals]);

  // Sync mute state to chime service
  useEffect(() => {
    chimeService.setMuted(audioMuted);
  }, [audioMuted]);

  // Evaluate routing whenever patientCard or hospitals change
  useEffect(() => {
    const ranked = routingEngineRef.current.evaluateHospitals(patientCard, hospitals);
    setRankedHospitals(ranked);
    // Auto-select the top-ranked eligible hospital
    const topEligible = ranked.find((h) => h.isEligible);
    if (topEligible && !isDispatched) {
      setSelectedHospitalId(topEligible.id);
    }
  }, [patientCard, hospitals, isDispatched]);

  // Keep transaction logs updated from BedLockService
  const refreshLogs = useCallback(() => {
    setTransactionLogs([...bedLockServiceRef.current.transactionLogs]);
  }, []);

  // 15-Minute Bed TTL Countdown Timer
  useEffect(() => {
    let timer;
    if (lockedBed && bedLockTimeRemaining > 0) {
      timer = setInterval(() => {
        setBedLockTimeRemaining((prev) => {
          if (prev <= 1) {
            // Lock expired!
            bedLockServiceRef.current.releaseLock(lockedBed.id, "TTL_EXPIRED");
            setLockedBed(null);
            refreshLogs();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [lockedBed, bedLockTimeRemaining, refreshLogs]);

  // Real-time live telemetry stream & GPS ticker
  useEffect(() => {
    let streamTimer;
    if (isStreamingTelemetry && isDispatched) {
      streamTimer = setInterval(() => {
        // Small physiological jitter
        setLiveVitals((prev) => {
          const hrJitter = Math.floor(Math.random() * 3) - 1;
          const spo2Jitter = Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0;
          const sbpJitter = Math.floor(Math.random() * 3) - 1;

          const updated = {
            ...prev,
            heartRate: Math.max(50, Math.min(180, prev.heartRate + hrJitter)),
            spO2: Math.max(70, Math.min(100, prev.spO2 + spo2Jitter)),
            bpSystolic: Math.max(60, Math.min(220, prev.bpSystolic + sbpJitter)),
          };

          telemetryService.emit(TELEMETRY_EVENTS.VITALS_UPDATE, updated);
          return updated;
        });

        // GPS decrement
        setCurrentEtaMinutes((prev) => {
          if (prev <= 1) return 1;
          const next = parseFloat((prev - 0.05).toFixed(2));
          telemetryService.emit(TELEMETRY_EVENTS.GPS_TICK, { eta: next });
          return next;
        });

        setDistanceRemainingKm((prev) => {
          if (prev <= 0.1) return 0.1;
          return parseFloat((prev - 0.03).toFixed(2));
        });
      }, 1500);
    }
    return () => clearInterval(streamTimer);
  }, [isStreamingTelemetry, isDispatched]);

  // Load a voice vignette preset
  const loadPreset = useCallback((presetId) => {
    const preset = VOICE_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    setSelectedPresetId(presetId);
    setVoiceTranscript(preset.speechText);
    const updatedCard = {
      ...patientCard,
      ...preset.parsedData,
      transcription: preset.speechText,
      language: preset.language,
    };
    setPatientCard(updatedCard);
    setLiveVitals({ ...preset.parsedData.vitals });
    setCurrentEtaMinutes(14);
    setDistanceRemainingKm(8.4);
    setCheckedItems({});
  }, [patientCard]);

  // Parse custom voice or typed text
  const parseVoiceInput = useCallback(async (transcript) => {
    setVoiceTranscript(transcript);
    const parsed = await audioServiceRef.current.parseTranscript(transcript);
    const updatedCard = {
      ...patientCard,
      ...parsed,
      transcription: transcript,
    };
    setPatientCard(updatedCard);
    setLiveVitals({ ...parsed.vitals });
  }, [patientCard]);

  // Toggle live mic recording
  const toggleRecording = useCallback(() => {
    if (isRecordingVoice) {
      audioServiceRef.current.stopListening();
      setIsRecordingVoice(false);
    } else {
      const initialized = audioServiceRef.current.initSpeechRecognition(
        (transcript) => {
          parseVoiceInput(transcript);
        },
        (err) => {
          console.warn("Speech recognition error:", err);
          setIsRecordingVoice(false);
        },
        () => {
          setIsRecordingVoice(false);
        }
      );
      if (initialized) {
        audioServiceRef.current.startListening();
        setIsRecordingVoice(true);
      } else {
        // Fallback: load random preset
        loadPreset(VOICE_PRESETS[1].id);
      }
    }
  }, [isRecordingVoice, parseVoiceInput, loadPreset]);

  // DISPATCH & ATOMIC LOCK HANDSHAKE
  const handleDispatchAndLock = useCallback(async () => {
    setIsLockingInProgress(true);

    const targetHospital = hospitals.find((h) => h.id === selectedHospitalId) || hospitals[0];

    // Trigger ACID row-level lock on bed
    const lockResult = await bedLockServiceRef.current.acquireLock(
      targetHospital.id,
      patientCard.requiredBedType,
      activeAmbulanceId,
      15 * 60 // 15 mins TTL
    );

    refreshLogs();
    setIsLockingInProgress(false);

    if (lockResult.success) {
      setLockedBed(lockResult.bed);
      setBedLockTimeRemaining(15 * 60);
      setIsDispatched(true);
      setParamedicStep(3); // Advance to En Route HUD!
      setIsStreamingTelemetry(true);
      setCurrentEtaMinutes(targetHospital.etaMinutes);
      setDistanceRemainingKm(targetHospital.distanceKm);

      // Trigger ER alerts (Slide 7: 2s ER flashes red, chime plays, 5s bed locked)
      setInboundEmergencyActive(true);
      setErFlashAlert(true);
      chimeService.playEmergencyChime();

      setTimeout(() => {
        setErFlashAlert(false);
      }, 3500);

      telemetryService.emit(TELEMETRY_EVENTS.AMBULANCE_DISPATCHED, {
        ambulanceId: activeAmbulanceId,
        hospitalId: targetHospital.id,
        bed: lockResult.bed,
        patient: patientCard,
      });
    } else {
      alert(`Lock Failed: ${lockResult.message}`);
    }
  }, [hospitals, selectedHospitalId, patientCard, activeAmbulanceId, refreshLogs]);

  // Release bed manually or upon arrival
  const handleReleaseBed = useCallback(async () => {
    if (lockedBed) {
      await bedLockServiceRef.current.releaseLock(lockedBed.id, "MANUAL_ER_RELEASE");
      setLockedBed(null);
      setBedLockTimeRemaining(0);
      setIsDispatched(false);
      setIsStreamingTelemetry(false);
      setInboundEmergencyActive(false);
      refreshLogs();
    }
  }, [lockedBed, refreshLogs]);

  // Extend bed lock (+5 mins)
  const handleExtendLock = useCallback(async () => {
    if (lockedBed) {
      await bedLockServiceRef.current.extendLock(lockedBed.id, 5 * 60);
      setBedLockTimeRemaining((prev) => prev + 5 * 60);
      refreshLogs();
    }
  }, [lockedBed, refreshLogs]);

  // Reset entire simulation
  const handleReset = useCallback(() => {
    bedLockServiceRef.current = new BedLockService();
    setLockedBed(null);
    setBedLockTimeRemaining(0);
    setIsDispatched(false);
    setParamedicStep(1); // Reset to Step 1
    setIsStreamingTelemetry(false);
    setInboundEmergencyActive(false);
    setErFlashAlert(false);
    loadPreset(VOICE_PRESETS[0].id);
    refreshLogs();
  }, [loadPreset, refreshLogs]);

  // Checklist check toggle
  const toggleChecklist = useCallback((itemIndex) => {
    setCheckedItems((prev) => ({
      ...prev,
      [itemIndex]: !prev[itemIndex],
    }));
  }, []);

  return (
    <PulseRouteContext.Provider
      value={{
        // View & Navigation
        viewMode,
        setViewMode,
        audioMuted,
        setAudioMuted,
        showFhirModal,
        setShowFhirModal,
        showAcidModal,
        setShowAcidModal,

        // Paramedic Wizard Step
        paramedicStep,
        setParamedicStep,

        // Paramedic / Ambulance State
        activeAmbulanceId,
        setActiveAmbulanceId,
        patientCard,
        setPatientCard,
        selectedPresetId,
        loadPreset,
        isRecordingVoice,
        toggleRecording,
        voiceTranscript,
        setVoiceTranscript,
        parseVoiceInput,

        // Routing & Hospitals
        hospitals,
        rankedHospitals,
        selectedHospitalId,
        setSelectedHospitalId,

        // Bed Locking & ACID state
        lockedBed,
        bedLockTimeRemaining,
        isLockingInProgress,
        transactionLogs,
        bedLockService: bedLockServiceRef.current,
        handleDispatchAndLock,
        handleReleaseBed,
        handleExtendLock,
        handleReset,
        refreshLogs,

        // Telemetry & En Route
        isDispatched,
        isStreamingTelemetry,
        setIsStreamingTelemetry,
        currentEtaMinutes,
        setCurrentEtaMinutes,
        distanceRemainingKm,
        liveVitals,
        setLiveVitals,
        clinicalMetrics,

        // ER Command Center
        inboundEmergencyActive,
        erFlashAlert,
        checkedItems,
        toggleChecklist,
      }}
    >
      {children}
    </PulseRouteContext.Provider>
  );
};

export const usePulseRoute = () => {
  const context = useContext(PulseRouteContext);
  if (!context) {
    throw new Error("usePulseRoute must be used within a PulseRouteProvider");
  }
  return context;
};
