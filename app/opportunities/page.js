"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/AppContext";
import EvidenceBadge from "@/components/EvidenceBadge";
import {
  TrendingUp,
  Target,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";

export default function MarketOpportunitiesPage() {
  const router = useRouter();
  const {
    insightsData,
    selectedProduct,
    setActiveAngleId,
    openEvidence,
  } = useApp();

  const [selectedConviction, setSelectedConviction] = useState("all");

  const { opportunityAreas } = insightsData;

  const filteredOpportunities = opportunityAreas.filter((opp) => {
    if (selectedConviction === "high" && !opp.convictionTier.toLowerCase().includes("high")) return false;
    if (selectedConviction === "moderate" && !opp.convictionTier.toLowerCase().includes("moderate")) return false;
    return true;
  });

  function handleLaunchStudio(angleId) {
    setActiveAngleId(angleId);
    router.push("/marketing-studio");
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line-subtle">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase font-bold text-terracotta">
              INTELLIGENCE
            </span>
            <span className="text-ink-muted text-xs">•</span>
            <span className="text-xs text-ink-muted">Market Opportunity Mapping</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink-primary">
            Market Opportunities & Strategic Angles
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted mt-0.5">
            Evidence-backed positioning opportunities derived from customer pain points and competitor formulation defects for{" "}
            <span className="font-semibold text-ink-primary">{selectedProduct.productName}</span>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/marketing-studio"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-terracotta text-ink-inverted text-xs font-semibold hover:bg-terracotta-hover transition-colors shadow-clay-sm"
          >
            <span>Open Marketing Studio →</span>
          </Link>
        </div>
      </div>

      {/* 1. Customer Needs vs Competitor Gaps Strategic Overview */}
      <div className="p-6 rounded-2xl bg-app-card border border-line-subtle shadow-clay-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-line-subtle">
          <h2 className="font-serif text-lg font-bold text-ink-primary flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-terracotta" />
            <span>Customer Needs vs Competitor Gaps Audit</span>
          </h2>
          <span className="text-xs font-mono text-ink-muted">
            Audited Convergence
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-app-subtle border border-line-subtle space-y-2">
            <div className="flex items-center gap-2 text-terracotta font-bold text-[11px] uppercase tracking-wider">
              <Target className="w-3.5 h-3.5" />
              <span>1. Unmet Customer Need</span>
            </div>
            <p className="text-ink-primary leading-relaxed font-medium">
              Indian consumers demand deep skin barrier restoration and hydration that will never trap perspiration during peak 85%+ coastal monsoon humidity.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-status-error-bg/50 border border-status-error/20 space-y-2">
            <div className="flex items-center gap-2 text-status-error font-bold text-[11px] uppercase tracking-wider">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>2. Competitor Vulnerability</span>
            </div>
            <p className="text-status-error leading-relaxed font-medium">
              Leading competitors (Minimalist, Plum, Derma Co) rely on occlusive B5 films and heavy silicones that act like plastic wrap or pill into rubbery balls under sunscreen.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-status-success-bg/50 border border-sage/20 space-y-2">
            <div className="flex items-center gap-2 text-status-success font-bold text-[11px] uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>3. Dot & Key Advantage</span>
            </div>
            <p className="text-status-success leading-relaxed font-medium">
              Water-break kombucha probiotic vehicle absorbs in under 10 seconds, leaving zero residue and priming flawlessly for high-SPF sunscreens.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Opportunity Cards Header & Filter */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-serif text-xl font-bold text-ink-primary">
              Validated Strategic Opportunity Angles
            </h2>
            <p className="text-xs text-ink-muted">
              Select an angle to launch directly into the Creative Studio with pre-grounded claims
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedConviction("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedConviction === "all"
                  ? "bg-terracotta text-ink-inverted font-semibold shadow-clay-sm"
                  : "bg-app-card text-ink-muted border border-line-subtle hover:text-ink-primary"
              }`}
            >
              All Angles ({opportunityAreas.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedConviction("high")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedConviction === "high"
                  ? "bg-status-success text-ink-inverted font-semibold shadow-clay-sm"
                  : "bg-app-card text-ink-muted border border-line-subtle hover:text-ink-primary"
              }`}
            >
              High Conviction Only
            </button>
          </div>
        </div>

        {/* Opportunity Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {filteredOpportunities.map((opp) => {
            const isHighConviction = opp.convictionTier.toLowerCase().includes("high");

            return (
              <div
                key={opp.id}
                className="p-6 rounded-2xl bg-app-card border border-line-subtle hover:border-line-strong transition-all shadow-clay-sm flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  {/* Conviction Tier & Angle ID */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        isHighConviction
                          ? "bg-status-success-bg text-status-success border-sage/30"
                          : "bg-sand-light text-ink-primary border-line-subtle"
                      }`}
                    >
                      {opp.convictionTier}
                    </span>
                    <span className="text-[10px] font-mono text-ink-muted">
                      {opp.recommendedAngle}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-xl font-bold text-ink-primary leading-snug">
                    {opp.title}
                  </h3>

                  {/* Target Problem */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase font-bold text-ink-muted block">
                      Target Consumer Problem
                    </span>
                    <p className="text-xs text-ink-primary leading-relaxed">
                      {opp.targetProblem}
                    </p>
                  </div>

                  {/* Competitor Flaw Summary */}
                  <div className="p-3.5 rounded-xl bg-status-error-bg border border-status-error/20 text-xs space-y-1">
                    <span className="text-status-error font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3" />
                      Audited Competitor Flaw
                    </span>
                    <p className="text-status-error text-[11px] leading-relaxed">
                      {opp.competitorFlawSummary}
                    </p>
                  </div>

                  {/* Dot & Key Advantage */}
                  <div className="p-3.5 rounded-xl bg-status-success-bg border border-sage/20 text-xs space-y-1">
                    <span className="text-status-success font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Dot & Key Advantage
                    </span>
                    <p className="text-status-success text-[11px] leading-relaxed">
                      {opp.dotKeyAdvantage}
                    </p>
                  </div>

                  {/* Supporting Evidence Badges */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-mono uppercase font-bold text-ink-muted block">
                      Anchored Evidence Citations
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {opp.supportingEvidenceIds.map((evId) => (
                        <EvidenceBadge key={evId} id={evId} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card CTA: Launch in Marketing Studio */}
                <div className="pt-4 border-t border-line-subtle">
                  <button
                    type="button"
                    onClick={() => handleLaunchStudio(opp.recommendedAngle)}
                    className="w-full py-2.5 px-4 rounded-xl bg-terracotta text-ink-inverted text-xs font-semibold hover:bg-terracotta-hover transition-all flex items-center justify-center gap-2 shadow-clay-sm"
                  >
                    <span>Launch in Marketing Studio</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
