import React from 'react';
import { BedDouble, CheckCircle, Clock, Key, Lock, PlusCircle, RefreshCw, XCircle } from 'lucide-react';
import { usePulseRoute } from '../../context/PulseRouteContext';
import { StatusBadge } from '../common/StatusBadge';

export const LockedBedCard = () => {
  const {
    lockedBed,
    bedLockTimeRemaining,
    handleExtendLock,
    handleReleaseBed,
    activeAmbulanceId,
  } = usePulseRoute();

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!lockedBed) {
    return (
      <div className="bg-[#111622] border border-[#1E2638] rounded-sm p-3 flex items-center justify-between font-mono text-xs text-[#64748B]">
        <div className="flex items-center gap-2">
          <BedDouble className="w-4 h-4 text-[#94A3B8]" />
          <span>BED RESERVATION ENGINE: READY FOR ACID TRANSACTIONAL LOCK</span>
        </div>
        <span className="text-[10px] text-[#00C853] bg-[#0C2417] px-2 py-0.5 rounded-sm border border-[#00C853]/30">
          SELECT ... FOR UPDATE MUTEX READY
        </span>
      </div>
    );
  }

  const isLowTime = bedLockTimeRemaining < 180; // less than 3 mins left

  return (
    <div className="bg-[#111622] border border-[#00C853]/60 rounded-sm p-3 font-mono text-xs flex flex-col gap-2 shadow-md">
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-1.5 border-b border-[#1E2638]">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-[#00C853] text-[#0B0E14] rounded-sm">
            <Lock className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-sm text-[#00C853] tracking-wide">
              {lockedBed.number.toUpperCase()} RESERVED & LOCKED
            </span>
            <span className="text-[10px] text-[#94A3B8] block">
              ACID PESSIMISTIC ROW-LEVEL LOCK ACTIVE
            </span>
          </div>
        </div>

        {/* TTL Countdown Clock */}
        <div className="flex items-center gap-2 bg-[#0B0E14] px-2.5 py-1 rounded-sm border border-[#1E2638]">
          <Clock className={`w-3.5 h-3.5 ${isLowTime ? 'text-[#E53935] animate-spin' : 'text-[#FB8C00]'}`} />
          <div className="flex flex-col text-right">
            <span className="text-[9px] text-[#64748B] uppercase">TTL EXPIRATION</span>
            <span className={`text-base font-bold ${isLowTime ? 'text-[#E53935]' : 'text-[#FB8C00]'}`}>
              {formatTime(bedLockTimeRemaining)}
            </span>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-4 gap-2 text-[11px] bg-[#0B0E14] p-2 rounded-sm border border-[#1E2638]">
        <div>
          <span className="text-[10px] text-[#64748B] block uppercase">HELD BY AMBULANCE</span>
          <span className="font-bold text-[#E2E8F0]">{activeAmbulanceId}</span>
        </div>
        <div>
          <span className="text-[10px] text-[#64748B] block uppercase">UNIT / BED TYPE</span>
          <span className="font-bold text-[#0288D1]">{lockedBed.type} RESUSCITATION</span>
        </div>
        <div>
          <span className="text-[10px] text-[#64748B] block uppercase">LOCK LEASE TOKEN</span>
          <span className="font-mono text-[#94A3B8] truncate block">{lockedBed.lockToken || "LOK-8941CC"}</span>
        </div>
        <div>
          <span className="text-[10px] text-[#64748B] block uppercase">ROW ISOLATION</span>
          <span className="text-[#00C853] font-semibold">FOR UPDATE (PGLOCK)</span>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center justify-between pt-1 border-t border-[#1E2638]">
        <div className="text-[10px] text-[#64748B]">
          Auto-releases upon timer expiration or patient transfer to prevent ghost bed blockage.
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExtendLock}
            className="flex items-center gap-1 px-2.5 py-1 bg-[#151B2B] hover:bg-[#1E2638] text-[#FB8C00] border border-[#FB8C00]/40 rounded-sm font-semibold transition-all text-[11px]"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>EXTEND (+5 MIN)</span>
          </button>
          <button
            onClick={handleReleaseBed}
            className="flex items-center gap-1 px-2.5 py-1 bg-[#2A1215] hover:bg-[#3D1418] text-[#E53935] border border-[#E53935]/50 rounded-sm font-semibold transition-all text-[11px]"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>RELEASE BED</span>
          </button>
        </div>
      </div>
    </div>
  );
};
