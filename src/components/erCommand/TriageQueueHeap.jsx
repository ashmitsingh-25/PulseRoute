import React from 'react';
import { ArrowUpDown, Layers, UserPlus, Users } from 'lucide-react';
import { usePulseRoute } from '../../context/PulseRouteContext';
import { StatusBadge } from '../common/StatusBadge';
import { ESI_LEVELS } from '../../contracts/TriageContracts';

export const TriageQueueHeap = () => {
  const {
    inboundEmergencyActive,
    activeAmbulanceId,
    patientCard,
    currentEtaMinutes,
    lockedBed,
  } = usePulseRoute();

  // Synthetic baseline queue patients in ER
  const baseQueue = [
    {
      id: "PT-9402",
      source: "WALK-IN",
      esi: 3,
      age: 42,
      sex: "F",
      complaint: "Acute abdominal pain, RLQ tenderness",
      location: "Bay 2 (Obs)",
      eta: "ARRIVED (18m ago)",
    },
    {
      id: "PT-1182",
      source: "AMB-042",
      esi: 2,
      age: 71,
      sex: "M",
      complaint: "COPD exacerbation, severe wheezing",
      location: "Bay 5 (ICU)",
      eta: "ARRIVED (4m ago)",
    },
    {
      id: "PT-8820",
      source: "INTERNAL",
      esi: 4,
      age: 19,
      sex: "M",
      complaint: "Distal radius fracture, splinted",
      location: "Minor Trauma A",
      eta: "ARRIVED (45m ago)",
    },
  ];

  // Min-Heap logic: Inbound emergency is injected and sorted by ESI level (ascending 1..5) then ETA
  const queue = [...baseQueue];

  if (inboundEmergencyActive) {
    queue.push({
      id: patientCard.patientId,
      source: activeAmbulanceId,
      esi: patientCard.esi,
      age: patientCard.age,
      sex: patientCard.sex,
      complaint: patientCard.complaint,
      location: lockedBed ? `${lockedBed.number} (RESERVED)` : "BAY ALLOCATION",
      eta: `ETA ${currentEtaMinutes}m`,
      isInbound: true,
    });
  }

  // Min-Heap sorting: Lowest ESI number = highest medical acuity (ESI 1 > ESI 2 > ESI 3...)
  queue.sort((a, b) => {
    if (a.esi !== b.esi) return a.esi - b.esi;
    // Tie-breaker: inbound prioritized
    return a.isInbound ? -1 : 1;
  });

  return (
    <div className="bg-[#111622] border border-[#1E2638] rounded-sm p-3 font-mono flex flex-col gap-2">
      {/* Header */}
      <div className="flex items-center justify-between pb-1.5 border-b border-[#1E2638]">
        <div className="flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-[#0288D1]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#E2E8F0]">
            INBOUND TRIAGE QUEUE // MIN-HEAP PRIORITY ORDERED
          </span>
        </div>
        <span className="text-[10px] text-[#64748B]">
          ORDER CRITERIA: MIN(ESI, ETA)
        </span>
      </div>

      {/* Queue Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#1E2638] text-[10px] text-[#64748B] uppercase">
              <th className="py-1 px-1.5">PRIORITY</th>
              <th className="py-1 px-1.5">PATIENT ID / UNIT</th>
              <th className="py-1 px-1.5">ACUITY (ESI)</th>
              <th className="py-1 px-1.5">CHIEF COMPLAINT</th>
              <th className="py-1 px-1.5">ALLOCATED BAY</th>
              <th className="py-1 px-1.5 text-right">STATUS / ETA</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E2638]/50">
            {queue.map((pt, idx) => {
              const esiInfo = ESI_LEVELS[pt.esi] || ESI_LEVELS[3];

              return (
                <tr
                  key={pt.id}
                  className={`transition-colors ${
                    pt.isInbound
                      ? "bg-[#0C2417]/40 font-semibold"
                      : "hover:bg-[#151B2B]/50"
                  }`}
                >
                  <td className="py-1.5 px-1.5 font-bold">
                    <span
                      className={`w-5 h-5 rounded-full inline-flex items-center justify-center text-[10px] ${
                        idx === 0
                          ? "bg-[#E53935] text-white"
                          : "bg-[#1E2638] text-[#94A3B8]"
                      }`}
                    >
                      #{idx + 1}
                    </span>
                  </td>
                  <td className="py-1.5 px-1.5">
                    <div className="flex flex-col">
                      <span className="font-bold text-[#E2E8F0]">{pt.id}</span>
                      <span className="text-[10px] text-[#64748B]">{pt.source} • {pt.age}Y/{pt.sex}</span>
                    </div>
                  </td>
                  <td className="py-1.5 px-1.5">
                    <StatusBadge
                      label={`ESI-${pt.esi}`}
                      variant={pt.esi === 1 ? 'critical' : pt.esi === 2 ? 'warning' : 'neutral'}
                      size="xs"
                    />
                  </td>
                  <td className="py-1.5 px-1.5 text-[#94A3B8] max-w-[200px] truncate">
                    {pt.complaint}
                  </td>
                  <td className="py-1.5 px-1.5 text-[#E2E8F0]">
                    <span className={pt.isInbound ? "text-[#00C853] font-bold" : ""}>
                      {pt.location}
                    </span>
                  </td>
                  <td className="py-1.5 px-1.5 text-right">
                    <span
                      className={`text-[11px] font-bold ${
                        pt.isInbound ? "text-[#00C853] animate-pulse" : "text-[#64748B]"
                      }`}
                    >
                      {pt.eta}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
