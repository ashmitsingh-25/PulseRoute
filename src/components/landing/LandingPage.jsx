import React from 'react';
import {
  Truck,
  Building2,
  Columns,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  HeartPulse,
  Clock,
  Lock,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { usePulseRoute } from '../../context/PulseRouteContext';

export const LandingPage = () => {
  const { setViewMode } = usePulseRoute();

  const roleCards = [
    {
      id: 'paramedic',
      badge: 'EMS Mobile Console',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: Truck,
      iconBg: 'bg-blue-600 text-white',
      title: 'Field Paramedic Unit',
      subtitle: 'En-route Patient Triage & Bed Hold',
      description:
        'Hands-free voice triage, automated ESI severity scoring, and intelligent clinical routing to capable cardiac and trauma centers.',
      features: [
        'Hands-free voice triage note assessment',
        'Multi-factor hospital cost scoring (best vs nearest)',
        '1-tap atomic bed lock reservation & dispatch',
      ],
      ctaText: 'Launch Paramedic Console',
      targetView: 'paramedic',
    },
    {
      id: 'hospital',
      badge: 'Hospital Operations',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: Building2,
      iconBg: 'bg-emerald-600 text-white',
      title: 'ER Command Dashboard',
      subtitle: 'Emergency Receiving Center & Bay Intake',
      description:
        'Live inbound countdown, real-time Lead II cardiac telemetry streaming, assigned bed allocation, and pre-arrival clinical checklists.',
      features: [
        'Immediate visual & audible emergency chime alert',
        'Continuous rolling ECG & vital signs telemetry',
        'Reserved bed status with 15-minute countdown TTL',
      ],
      ctaText: 'Open Receiving Center',
      targetView: 'hospital',
    },
    {
      id: 'split',
      badge: 'Executive Evaluation',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: Columns,
      iconBg: 'bg-purple-600 text-white',
      title: 'Live Dual-Screen Demo',
      subtitle: 'Synchronized End-to-End Presentation',
      description:
        'Side-by-side synchronized demonstration linking ambulance dispatch directly to hospital trauma bay readiness for live stakeholder evaluation.',
      features: [
        'Side-by-side ambulance and hospital ER workflow',
        'Demonstrates 90-second golden hour handoff',
        'Interactive ACID concurrency benchmark',
      ],
      ctaText: 'Start Interactive Split Demo',
      targetView: 'split',
      highlight: true,
    },
  ];

  return (
    <div className="h-full w-full overflow-y-auto bg-slate-50 flex flex-col justify-between p-6 md:p-10">
      <div className="max-w-6xl w-full mx-auto flex flex-col items-center">
        {/* Hero Section */}
        <div className="text-center max-w-3xl flex flex-col items-center mt-2 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-4 shadow-2xs">
            <HeartPulse className="w-4 h-4 text-blue-600" />
            <span>Emergency Pre-Arrival & Direct Bed Allocation Network</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Zero Lost Minutes in the Golden Hour.
          </h1>

          <p className="mt-4 text-base md:text-lg text-slate-600 leading-relaxed max-w-2xl">
            Dynamic ambulance triage, AI-assisted specialty routing, and atomic bed reservation before hospital arrival.
          </p>
        </div>

        {/* 3 Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {roleCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.id}
                className={`bg-white rounded-2xl border p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-md ${
                  card.highlight
                    ? "border-blue-300 ring-2 ring-blue-500/10 shadow-sm"
                    : "border-slate-200 shadow-xs hover:border-slate-300"
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center shadow-xs`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${card.badgeColor}`}>
                      {card.badge}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-xl font-bold text-slate-900 mb-1">
                    {card.title}
                  </h3>
                  <span className="text-xs font-medium text-slate-400 block mb-3">
                    {card.subtitle}
                  </span>

                  {/* Description */}
                  <p className="text-sm text-slate-600 leading-relaxed mb-5">
                    {card.description}
                  </p>

                  {/* Feature Checklist */}
                  <div className="space-y-2 pt-4 border-t border-slate-100 mb-6">
                    {card.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Primary CTA */}
                <button
                  onClick={() => setViewMode(card.targetView)}
                  className={`w-full py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all group ${
                    card.highlight
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                      : "bg-slate-900 hover:bg-slate-800 text-white shadow-xs"
                  }`}
                >
                  <span>{card.ctaText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Metric Strip */}
      <div className="max-w-4xl w-full mx-auto mt-10 pt-6 border-t border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-slate-600 font-medium">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>15-Min Atomic Bed Locks</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-slate-600 font-medium">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>Zero Double-Bookings (ACID Safe)</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-slate-600 font-medium">
            <Activity className="w-4 h-4 text-purple-600" />
            <span>Real-time WebSocket Telemetry</span>
          </div>
        </div>
      </div>
    </div>
  );
};
