"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useApp } from "@/components/AppContext";
import EvidenceBadge from "@/components/EvidenceBadge";
import {
  Scale,
  Star,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export default function CompetitorsPage() {
  const {
    selectedProduct,
    competitors,
    openEvidence,
  } = useApp();

  const [searchFilter, setSearchFilter] = useState("");
  const [selectedCompId, setSelectedCompId] = useState("all");

  const filteredCompetitors = useMemo(() => {
    return competitors.filter((c) => {
      if (selectedCompId !== "all" && c.id !== selectedCompId) return false;
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase();
        const matchBrand = c.brand.toLowerCase().includes(q);
        const matchName = c.productName.toLowerCase().includes(q);
        const matchFlaw = c.identifiedFlaw?.toLowerCase().includes(q);
        const matchPos = c.positioning?.toLowerCase().includes(q);
        if (!matchBrand && !matchName && !matchFlaw && !matchPos) return false;
      }
      return true;
    });
  }, [competitors, selectedCompId, searchFilter]);

  // Evidence map for competitor flaw reviews
  const competitorEvidenceMap = {
    "CP-MIN-01": "REV-CP001",
    "CP-PLUM-02": "REV-CP002",
    "CP-DERMA-03": "REV-CP003",
    "CP-FOXTALE-04": "REV-CP004",
    "CP-AQUA-05": "REV-CP005",
  };

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
            <span className="text-xs text-ink-muted">5-Brand Market Audit</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink-primary">
            Competitor Analysis & Benchmarking
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted mt-0.5">
            Normalized retail comparison of 5 leading Indian skincare competitors against active subject{" "}
            <span className="font-semibold text-ink-primary">{selectedProduct.productName}</span>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/opportunities"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-terracotta text-ink-inverted text-xs font-semibold hover:bg-terracotta-hover transition-colors shadow-clay-sm"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>View Opportunities →</span>
          </Link>
        </div>
      </div>

      {/* 1. Comparison Matrix Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-bold text-ink-primary">
              Normalized Competitive Matrix
            </h2>
            <p className="text-xs text-ink-muted">
              Side-by-side comparison across pricing, normalized metrics, ratings, volume, and positioning
            </p>
          </div>
          <span className="text-[11px] font-mono text-ink-muted">
            Standardized per ML
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-line-subtle bg-app-card shadow-clay-sm custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs min-w-[760px]">
            <thead>
              <tr className="bg-app-subtle border-b border-line-subtle text-[11px] font-mono text-ink-muted uppercase tracking-wider">
                <th className="py-3.5 px-4 font-semibold w-44">Metric / Dimension</th>
                {/* Active Subject (Dot & Key) Column */}
                <th className="py-3.5 px-4 bg-terracotta/10 text-terracotta font-bold w-52 border-x border-terracotta/20">
                  <div className="flex items-center justify-between">
                    <span>{selectedProduct.brand} (Subject)</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-terracotta text-ink-inverted">
                      ACTIVE
                    </span>
                  </div>
                </th>
                {competitors.map((c) => (
                  <th key={c.id} className="py-3.5 px-4 font-semibold text-ink-primary">
                    {c.brand}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line-subtle">
              {/* Product Title */}
              <tr className="hover:bg-app-subtle/50 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-ink-primary">Product Title</td>
                <td className="py-3.5 px-4 font-bold text-ink-primary bg-terracotta/5 border-x border-terracotta/10">
                  <div>{selectedProduct.productName}</div>
                  <EvidenceBadge id={selectedProduct.evidenceId} className="mt-1" />
                </td>
                {competitors.map((c) => (
                  <td key={c.id} className="py-3.5 px-4 text-ink-primary font-medium">
                    <div>{c.productName}</div>
                    <EvidenceBadge id={c.evidenceId} className="mt-1" />
                  </td>
                ))}
              </tr>

              {/* Retail Price and Volume */}
              <tr className="hover:bg-app-subtle/50 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-ink-primary">Price & Volume</td>
                <td className="py-3.5 px-4 font-bold text-ink-primary bg-terracotta/5 border-x border-terracotta/10">
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
                <td className="py-3.5 px-4 font-bold text-terracotta bg-terracotta/10 border-x border-terracotta/20">
                  ₹{selectedProduct.pricePerML} / ml
                  <span className="block text-[10px] text-status-success font-medium">Superior Value</span>
                </td>
                {competitors.map((c) => (
                  <td key={c.id} className="py-3.5 px-4 text-ink-primary font-semibold">
                    ₹{c.pricePerML} / ml
                  </td>
                ))}
              </tr>

              {/* Customer Rating */}
              <tr className="hover:bg-app-subtle/50 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-ink-primary">Customer Rating</td>
                <td className="py-3.5 px-4 font-bold text-ink-primary bg-terracotta/5 border-x border-terracotta/10">
                  ★ {selectedProduct.rating} / 5.0
                </td>
                {competitors.map((c) => (
                  <td key={c.id} className="py-3.5 px-4 text-ink-primary">
                    ★ {c.rating} / 5.0
                  </td>
                ))}
              </tr>

              {/* Review Volume Audited */}
              <tr className="hover:bg-app-subtle/50 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-ink-primary">Audited Reviews</td>
                <td className="py-3.5 px-4 font-mono font-bold text-ink-primary bg-terracotta/5 border-x border-terracotta/10">
                  {selectedProduct.reviewCount?.toLocaleString()} reviews
                </td>
                {competitors.map((c) => (
                  <td key={c.id} className="py-3.5 px-4 font-mono text-ink-muted">
                    {c.reviewCount?.toLocaleString()} reviews
                  </td>
                ))}
              </tr>

              {/* Texture & Finish */}
              <tr className="hover:bg-app-subtle/50 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-ink-primary">Texture & Finish</td>
                <td className="py-3.5 px-4 text-ink-primary bg-terracotta/5 border-x border-terracotta/10">
                  <div className="font-semibold">{selectedProduct.texture}</div>
                  <div className="text-[11px] text-ink-muted">{selectedProduct.finish}</div>
                </td>
                {competitors.map((c) => (
                  <td key={c.id} className="py-3.5 px-4 text-ink-muted">
                    <div className="font-medium text-ink-primary">{c.texture}</div>
                    <div className="text-[11px]">{c.finish}</div>
                  </td>
                ))}
              </tr>

              {/* Hero Actives */}
              <tr className="hover:bg-app-subtle/50 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-ink-primary">Hero Actives</td>
                <td className="py-3.5 px-4 text-ink-primary bg-terracotta/5 border-x border-terracotta/10">
                  {selectedProduct?.activeIngredients
                    ? selectedProduct.activeIngredients.slice(0, 2).join(", ")
                    : "Key actives"}
                </td>
                {competitors.map((c) => (
                  <td key={c.id} className="py-3.5 px-4 text-ink-muted">
                    {c.activeIngredients
                      ? c.activeIngredients.slice(0, 2).join(", ")
                      : "Key actives"}
                  </td>
                ))}
              </tr>

              {/* Positioning Statement */}
              <tr className="hover:bg-app-subtle/50 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-ink-primary">Market Positioning</td>
                <td className="py-3.5 px-4 font-medium text-terracotta bg-terracotta/5 border-x border-terracotta/10 text-[11px]">
                  {selectedProduct.positioning || "Deep cellular hydration without humidity grease"}
                </td>
                {competitors.map((c) => (
                  <td key={c.id} className="py-3.5 px-4 text-ink-muted text-[11px]">
                    {c.positioning}
                  </td>
                ))}
              </tr>

              {/* Audited Flaw / Advantage */}
              <tr className="hover:bg-app-subtle/50 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-ink-primary">Audited Defect / Strength</td>
                <td className="py-3.5 px-4 text-status-success font-semibold bg-terracotta/5 border-x border-terracotta/10 text-[11px]">
                  ✓ Absorbs in 10s with zero silicone pilling under SPF
                </td>
                {competitors.map((c) => (
                  <td key={c.id} className="py-3.5 px-4 text-status-error text-[11px]">
                    <div className="font-medium">⚠ {c.identifiedFlaw}</div>
                    <EvidenceBadge
                      id={competitorEvidenceMap[c.id]}
                      className="mt-1"
                      label="Inspect Review"
                    />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Individual Competitor Vulnerability Cards */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-serif text-xl font-bold text-ink-primary">
              Audited Competitor Vulnerabilities
            </h2>
            <p className="text-xs text-ink-muted">
              Deep dive into specific formulation flaws flagged by verified buyers in public retail records
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-2">
            <select
              value={selectedCompId}
              onChange={(e) => setSelectedCompId(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-app-subtle border border-line-subtle text-xs text-ink-primary focus:border-terracotta focus:outline-none cursor-pointer"
            >
              <option value="all">All 5 Competitors</option>
              {competitors.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.brand}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompetitors.map((comp) => {
            const evId = competitorEvidenceMap[comp.id];

            return (
              <div
                key={comp.id}
                className="p-5 sm:p-6 rounded-2xl bg-app-card border border-line-subtle hover:border-line-strong transition-all shadow-clay-sm flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Brand & Price Header */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-app-subtle text-ink-primary border border-line-subtle">
                      {comp.brand}
                    </span>
                    <span className="font-mono text-xs font-semibold text-terracotta">
                      ₹{comp.retailPriceINR} ({comp.volumeML}ml)
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif text-base font-bold text-ink-primary leading-snug">
                      {comp.productName}
                    </h3>
                    <span className="text-xs text-ink-muted block mt-0.5">
                      {comp.category} • ★ {comp.rating} ({comp.reviewCount?.toLocaleString()})
                    </span>
                  </div>

                  {/* Positioning Tagline */}
                  <div className="text-[11px] text-ink-muted bg-app-subtle p-2.5 rounded-lg border border-line-subtle">
                    <strong>Claimed Positioning:</strong> {comp.positioning}
                  </div>

                  {/* Identified Flaw Box */}
                  <div className="p-3.5 rounded-xl bg-status-error-bg border border-status-error/20 text-xs space-y-2">
                    <div className="flex items-center justify-between text-status-error font-bold text-[11px] uppercase tracking-wider">
                      <span className="flex items-center gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        Identified Vulnerability
                      </span>
                    </div>
                    <p className="text-status-error text-[11px] leading-relaxed">
                      {comp.identifiedFlaw}
                    </p>
                    <div className="pt-1">
                      <EvidenceBadge id={evId} label={`Inspect ${evId}`} />
                    </div>
                  </div>

                  {/* Dot & Key Counter-Position */}
                  <div className="p-3.5 rounded-xl bg-status-success-bg border border-sage/20 text-xs space-y-1">
                    <span className="text-status-success font-bold text-[10px] uppercase tracking-wider block">
                      Dot & Key Counter-Position
                    </span>
                    <p className="text-status-success text-[11px] leading-relaxed">
                      {selectedProduct.productName} absorbs in 10s with cold kombucha and 5-weight Hyaluronic acid, leaving zero occlusive film or pilling residue.
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-line-subtle flex items-center justify-between text-xs">
                  <span className="font-mono text-[10px] text-ink-muted">
                    Per ML: ₹{comp.pricePerML}
                  </span>
                  <button
                    type="button"
                    onClick={() => openEvidence(comp)}
                    className="text-terracotta hover:underline font-semibold text-[11px] flex items-center gap-1"
                  >
                    <span>Full Spec</span>
                    <ExternalLink className="w-3 h-3" />
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
