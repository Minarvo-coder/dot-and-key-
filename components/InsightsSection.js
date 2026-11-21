"use client";

import React from "react";
import {
  TrendingUp,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  ArrowRight,
  Compass,
  CheckCircle,
  HelpCircle,
  AlertTriangle,
} from "lucide-react";

export default function InsightsSection({
  selectedProduct,
  competitors,
  insightsData,
  onInspectEvidenceById,
  onSelectOpportunity,
}) {
  const { sentimentBreakdown, swot, opportunityAreas } = insightsData;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h2 className="font-serif text-2xl sm:text-3xl text-ink-primary font-bold">
          Market Intelligence & Grounded Insights
        </h2>
        <p className="text-xs sm:text-sm text-ink-muted mt-1">
          Grounded SWOT analysis, competitor comparison matrix, and validated market opportunity angles backed by evidence IDs.
        </p>
      </div>

      {/* 1. Comparison Table Matrix */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl font-bold text-ink-primary flex items-center gap-2">
            <span>Competitive Normalization Matrix</span>
          </h3>
          <span className="text-xs text-ink-muted">Standardized across retail metrics</span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-line-subtle bg-app-card shadow-clay-sm">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-app-subtle border-b border-line-subtle text-[11px] font-semibold text-ink-muted uppercase tracking-wider">
                <th className="py-3.5 px-4 font-semibold">Metric / Feature</th>
                <th className="py-3.5 px-4 bg-terracotta/10 text-terracotta font-bold">
                  {selectedProduct.brand} (Subject)
                </th>
                {competitors.map((c) => (
                  <th key={c.id} className="py-3.5 px-4 font-semibold text-ink-primary">
                    {c.brand}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line-subtle">
              {/* Product Name */}
              <tr className="hover:bg-app-subtle/50 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-ink-primary">Product Title</td>
                <td className="py-3.5 px-4 font-bold text-ink-primary bg-terracotta/5">
                  {selectedProduct.productName}
                </td>
                {competitors.map((c) => (
                  <td key={c.id} className="py-3.5 px-4 text-ink-primary">
                    {c.productName}
                  </td>
                ))}
              </tr>

              {/* Retail Price and Normalized per ML */}
              <tr className="hover:bg-app-subtle/50 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-ink-primary">Price and Volume</td>
                <td className="py-3.5 px-4 font-bold text-ink-primary bg-terracotta/5">
                  ₹{selectedProduct.retailPriceINR} ({selectedProduct.volumeML}ml)
                </td>
                {competitors.map((c) => (
                  <td key={c.id} className="py-3.5 px-4 text-ink-primary">
                    ₹{c.retailPriceINR} ({c.volumeML}ml)
                  </td>
                ))}
              </tr>

              {/* Standardized Price per ML */}
              <tr className="hover:bg-app-subtle/50 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-ink-primary">Price / ml (Normalized)</td>
                <td className="py-3.5 px-4 font-bold text-terracotta bg-terracotta/5">
                  ₹{selectedProduct.pricePerML} / ml
                </td>
                {competitors.map((c) => (
                  <td key={c.id} className="py-3.5 px-4 text-ink-primary">
                    ₹{c.pricePerML} / ml
                  </td>
                ))}
              </tr>

              {/* Rating */}
              <tr className="hover:bg-app-subtle/50 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-ink-primary">Customer Rating</td>
                <td className="py-3.5 px-4 font-bold text-ink-primary bg-terracotta/5">
                  ★ {selectedProduct.rating} / 5.0
                </td>
                {competitors.map((c) => (
                  <td key={c.id} className="py-3.5 px-4 text-ink-primary">
                    ★ {c.rating} / 5.0
                  </td>
                ))}
              </tr>

              {/* Texture and Finish */}
              <tr className="hover:bg-app-subtle/50 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-ink-primary">Texture and Finish</td>
                <td className="py-3.5 px-4 font-medium text-ink-primary bg-terracotta/5">
                  {selectedProduct.texture} ({selectedProduct.finish})
                </td>
                {competitors.map((c) => (
                  <td key={c.id} className="py-3.5 px-4 text-ink-muted">
                    {c.texture} ({c.finish})
                  </td>
                ))}
              </tr>

              {/* Hero Actives */}
              <tr className="hover:bg-app-subtle/50 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-ink-primary">Hero Actives</td>
                <td className="py-3.5 px-4 text-ink-primary bg-terracotta/5">
                  {selectedProduct.activeIngredients.slice(0, 2).join(", ")}
                </td>
                {competitors.map((c) => (
                  <td key={c.id} className="py-3.5 px-4 text-ink-muted">
                    {c.activeIngredients.slice(0, 2).join(", ")}
                  </td>
                ))}
              </tr>

              {/* Verified Advantage vs Flaw */}
              <tr className="hover:bg-app-subtle/50 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-ink-primary">Audited Market Note</td>
                <td className="py-3.5 px-4 text-status-success font-medium bg-terracotta/5">
                  Fast 10s absorption, zero pilling under SPF
                </td>
                {competitors.map((c) => (
                  <td key={c.id} className="py-3.5 px-4 text-status-error text-[11px]">
                    {c.identifiedFlaw}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Customer Sentiment Spectrum */}
      <div className="p-6 rounded-2xl bg-app-card border border-line-subtle shadow-clay-sm space-y-6">
        <div>
          <h3 className="font-serif text-xl font-bold text-ink-primary">
            Customer Sentiment Spectrum
          </h3>
          <p className="text-xs text-ink-muted">
            Aggregated from 4,820 customer reviews across Nykaa, Amazon India, and brand stores
          </p>
        </div>

        {/* Visual Distribution Bar */}
        <div className="space-y-2">
          <div className="w-full h-4 rounded-full overflow-hidden flex bg-line-subtle">
            <div
              style={{ width: `${sentimentBreakdown.positivePercent}%` }}
              className="bg-sage-dark transition-all"
              title={`Positive: ${sentimentBreakdown.positivePercent}%`}
            />
            <div
              style={{ width: `${sentimentBreakdown.neutralPercent}%` }}
              className="bg-sand transition-all"
              title={`Neutral: ${sentimentBreakdown.neutralPercent}%`}
            />
            <div
              style={{ width: `${sentimentBreakdown.criticalPercent}%` }}
              className="bg-status-error transition-all"
              title={`Critical: ${sentimentBreakdown.criticalPercent}%`}
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-sage-dark inline-block" />
              <span className="font-semibold text-ink-primary">
                Positive {sentimentBreakdown.positivePercent}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-sand inline-block" />
              <span className="font-semibold text-ink-primary">
                Neutral {sentimentBreakdown.neutralPercent}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-status-error inline-block" />
              <span className="font-semibold text-ink-primary">
                Critical {sentimentBreakdown.criticalPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Sentiment Drivers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-status-success-bg border border-sage/20 space-y-2">
            <span className="text-xs font-semibold text-status-success uppercase tracking-wider block">
              Top Customer Praises
            </span>
            <ul className="space-y-1.5 text-xs text-ink-primary">
              {sentimentBreakdown.keyPositiveDrivers.map((driver, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-status-success font-bold">✓</span>
                  <span>{driver}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-status-warning-bg border border-status-warning/20 space-y-2">
            <span className="text-xs font-semibold text-status-warning uppercase tracking-wider block">
              Customer Friction Points
            </span>
            <ul className="space-y-1.5 text-xs text-ink-primary">
              {sentimentBreakdown.keyCriticalDrivers.map((driver, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-status-warning font-bold">!</span>
                  <span>{driver}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 3. Grounded SWOT Analysis Grid */}
      <div className="space-y-4">
        <div>
          <h3 className="font-serif text-2xl font-bold text-ink-primary">
            Grounded SWOT Analysis
          </h3>
          <p className="text-xs text-ink-muted">
            Every observation references verifiable evidence IDs. Click any badge to view original source excerpts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Strengths */}
          <div className="p-5 rounded-2xl bg-app-card border border-line-subtle shadow-clay-sm space-y-3">
            <div className="flex items-center gap-2 text-status-success font-serif text-lg font-bold">
              <ShieldCheck className="w-5 h-5" />
              <span>Strengths</span>
            </div>
            <ul className="space-y-2.5 text-xs">
              {swot.strengths.map((item, i) => (
                <li key={i} className="flex items-start justify-between gap-2 leading-relaxed">
                  <span className="text-ink-primary">{item.text}</span>
                  <button
                    onClick={() => onInspectEvidenceById(item.evidence)}
                    className="font-mono text-[10px] px-2 py-0.5 rounded bg-sage-soft text-sage-dark font-semibold border border-sage/20 shrink-0 hover:bg-terracotta hover:text-ink-inverted transition-colors"
                  >
                    [{item.evidence}]
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="p-5 rounded-2xl bg-app-card border border-line-subtle shadow-clay-sm space-y-3">
            <div className="flex items-center gap-2 text-status-warning font-serif text-lg font-bold">
              <ShieldAlert className="w-5 h-5" />
              <span>Weaknesses</span>
            </div>
            <ul className="space-y-2.5 text-xs">
              {swot.weaknesses.map((item, i) => (
                <li key={i} className="flex items-start justify-between gap-2 leading-relaxed">
                  <span className="text-ink-primary">{item.text}</span>
                  <button
                    onClick={() => onInspectEvidenceById(item.evidence)}
                    className="font-mono text-[10px] px-2 py-0.5 rounded bg-sand-light text-ink-primary font-semibold border border-line-subtle shrink-0 hover:bg-terracotta hover:text-ink-inverted transition-colors"
                  >
                    [{item.evidence}]
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Opportunities */}
          <div className="p-5 rounded-2xl bg-app-card border border-line-subtle shadow-clay-sm space-y-3">
            <div className="flex items-center gap-2 text-terracotta font-serif text-lg font-bold">
              <TrendingUp className="w-5 h-5" />
              <span>Opportunities</span>
            </div>
            <ul className="space-y-2.5 text-xs">
              {swot.opportunities.map((item, i) => (
                <li key={i} className="flex items-start justify-between gap-2 leading-relaxed">
                  <span className="text-ink-primary">{item.text}</span>
                  <button
                    onClick={() => onInspectEvidenceById(item.evidence)}
                    className="font-mono text-[10px] px-2 py-0.5 rounded bg-terracotta/10 text-terracotta font-semibold border border-terracotta/20 shrink-0 hover:bg-terracotta hover:text-ink-inverted transition-colors"
                  >
                    [{item.evidence}]
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Threats */}
          <div className="p-5 rounded-2xl bg-app-card border border-line-subtle shadow-clay-sm space-y-3">
            <div className="flex items-center gap-2 text-status-error font-serif text-lg font-bold">
              <AlertTriangle className="w-5 h-5" />
              <span>Threats</span>
            </div>
            <ul className="space-y-2.5 text-xs">
              {swot.threats.map((item, i) => (
                <li key={i} className="flex items-start justify-between gap-2 leading-relaxed">
                  <span className="text-ink-primary">{item.text}</span>
                  <button
                    onClick={() => onInspectEvidenceById(item.evidence)}
                    className="font-mono text-[10px] px-2 py-0.5 rounded bg-status-error-bg text-status-error font-semibold border border-status-error/20 shrink-0 hover:bg-terracotta hover:text-ink-inverted transition-colors"
                  >
                    [{item.evidence}]
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 4. Strategic Market Opportunities (Dossiers) */}
      <div className="space-y-4">
        <div>
          <h3 className="font-serif text-2xl font-bold text-ink-primary">
            Validated Strategic Opportunity Angles
          </h3>
          <p className="text-xs text-ink-muted">
            High-conviction market gaps turning competitor weaknesses directly into high-converting Dot & Key marketing campaigns.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {opportunityAreas.map((opp) => (
            <div
              key={opp.id}
              className="p-6 rounded-2xl bg-app-card border-l-4 border-l-terracotta border-y border-r border-line-subtle shadow-clay-sm flex flex-col justify-between space-y-4 hover:shadow-clay-md transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-terracotta px-2 py-0.5 rounded bg-terracotta/10">
                    {opp.convictionTier}
                  </span>
                </div>

                <h4 className="font-serif text-lg font-bold text-ink-primary leading-snug">
                  {opp.title}
                </h4>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-ink-muted block text-[10px] uppercase font-semibold">
                      Consumer Pain Point
                    </span>
                    <p className="text-ink-primary leading-relaxed">{opp.targetProblem}</p>
                  </div>

                  <div>
                    <span className="text-status-error block text-[10px] uppercase font-semibold">
                      Competitor Flaw
                    </span>
                    <p className="text-ink-muted leading-relaxed">{opp.competitorFlawSummary}</p>
                  </div>

                  <div>
                    <span className="text-status-success block text-[10px] uppercase font-semibold">
                      Dot & Key Advantage
                    </span>
                    <p className="text-ink-primary leading-relaxed">{opp.dotKeyAdvantage}</p>
                  </div>
                </div>

                {/* Evidence Links */}
                <div className="pt-2">
                  <span className="text-[10px] font-mono text-ink-muted block mb-1">
                    Supporting Citations:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {opp.supportingEvidenceIds.map((evId) => (
                      <button
                        key={evId}
                        onClick={() => onInspectEvidenceById(evId)}
                        className="font-mono text-[10px] px-2 py-0.5 rounded bg-app-subtle text-ink-primary hover:bg-terracotta hover:text-ink-inverted border border-line-subtle transition-colors"
                      >
                        [{evId}]
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button to Transfer into Creative Studio */}
              <div className="pt-4 border-t border-line-subtle">
                <button
                  onClick={() => onSelectOpportunity(opp.recommendedAngle)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-terracotta text-ink-inverted hover:bg-terracotta-hover text-xs font-semibold transition-all shadow-clay-sm"
                >
                  <span>Build Campaign in Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
