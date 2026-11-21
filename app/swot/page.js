"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/components/AppContext";
import EvidenceBadge from "@/components/EvidenceBadge";
import {
  Grid,
  TrendingUp,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Zap,
  ArrowRight,
  Compass,
  CheckCircle,
} from "lucide-react";

export default function SWOTPage() {
  const { insightsData, selectedProduct } = useApp();
  const [activeQuadrant, setActiveQuadrant] = useState("all");

  const { swot } = insightsData;

  const quadrants = [
    {
      id: "strengths",
      title: "Strengths (Internal)",
      desc: "Proven clinical advantages & verified consumer praise",
      items: swot.strengths,
      icon: ShieldCheck,
      color: "text-status-success",
      bg: "bg-status-success-bg/60",
      border: "border-sage/30",
    },
    {
      id: "weaknesses",
      title: "Weaknesses (Internal)",
      desc: "Packaging frictions & long-wear afternoon shine",
      items: swot.weaknesses,
      icon: AlertTriangle,
      color: "text-status-warning",
      bg: "bg-status-warning-bg/60",
      border: "border-status-warning/20",
    },
    {
      id: "opportunities",
      title: "Opportunities (Market)",
      desc: "Competitor defect capture & anti-pilling morning positioning",
      items: swot.opportunities,
      icon: TrendingUp,
      color: "text-terracotta",
      bg: "bg-terracotta/5",
      border: "border-terracotta/20",
    },
    {
      id: "threats",
      title: "Threats (Market)",
      desc: "Aggressive pharma discounting & formula reformulations",
      items: swot.threats,
      icon: ShieldAlert,
      color: "text-status-error",
      bg: "bg-status-error-bg/60",
      border: "border-status-error/20",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line-subtle">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase font-bold text-terracotta">
              TOOLS & SETTINGS
            </span>
            <span className="text-ink-muted text-xs">•</span>
            <span className="text-xs text-ink-muted">Grounded Strategic Matrix</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink-primary">
            SWOT Analysis Matrix
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted mt-0.5">
            Four-quadrant strategic diagnostic grounded in verified buyer audits for{" "}
            <span className="font-semibold text-ink-primary">{selectedProduct.productName}</span>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/marketing-studio"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-terracotta text-ink-inverted text-xs font-semibold hover:bg-terracotta-hover transition-colors shadow-clay-sm"
          >
            <span>Bridge to Marketing Studio →</span>
          </Link>
        </div>
      </div>

      {/* 4 Quadrants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quadrants.map((quad) => {
          const Icon = quad.icon;
          return (
            <div
              key={quad.id}
              className={`p-6 rounded-2xl border ${quad.border} ${quad.bg} shadow-clay-sm space-y-4`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-line-subtle/50">
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg bg-app-card ${quad.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className={`font-serif text-lg font-bold ${quad.color}`}>
                      {quad.title}
                    </h2>
                    <p className="text-[11px] text-ink-muted">{quad.desc}</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-app-card text-ink-primary border border-line-subtle">
                  {quad.items.length} Points
                </span>
              </div>

              <div className="space-y-3">
                {quad.items.map((item, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-app-card border border-line-subtle/70 text-xs space-y-2 shadow-sm"
                  >
                    <p className="text-ink-primary leading-relaxed font-medium">
                      {item.text}
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] font-mono text-ink-muted">
                        Evidence Citation:
                      </span>
                      <EvidenceBadge id={item.evidence} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Strategic Synthesis Card */}
      <div className="p-6 rounded-2xl bg-app-card border border-line-subtle shadow-clay-sm space-y-3">
        <h3 className="font-serif text-base font-bold text-ink-primary flex items-center gap-2">
          <Zap className="w-4 h-4 text-terracotta" />
          <span>Strategic Synthesis & Executive Priority</span>
        </h3>
        <p className="text-xs text-ink-muted leading-relaxed">
          The highest-leverage marketing opportunity for {selectedProduct.productName} is counter-positioning against competitor occlusive sweat-trapping and sunscreen pilling. By hero-ing the 10-second watery absorption and Kombucha barrier repair, Dot & Key captures humid-climate market share while disarming lower-priced clinical pharmaceutical competitors.
        </p>
      </div>
    </div>
  );
}
