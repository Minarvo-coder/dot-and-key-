"use client";

import React, { useState } from "react";
import {
  ExternalLink,
  ShieldCheck,
  Star,
  AlertTriangle,
  Info,
  CheckCircle,
  Clock,
  Sparkles,
} from "lucide-react";
import { checkUnitCompatibility } from "@/data/research/dataEngine";

export default function CompetitorComparisonTable({
  primaryProduct,
  competitors = [],
  onInspectEvidence,
}) {
  const [highlightMetric, setHighlightMetric] = useState("all");

  if (!primaryProduct && competitors.length === 0) {
    return (
      <div className="p-8 text-center rounded-2xl border-2 border-dashed border-line-subtle bg-app-card/60">
        <Info className="w-8 h-8 text-ink-muted mx-auto mb-2" />
        <h3 className="font-serif text-lg font-bold text-ink-primary">
          Comparison Table Unavailable
        </h3>
        <p className="text-xs text-ink-muted mt-1">
          No primary product or competitors configured in the active dataset.
        </p>
      </div>
    );
  }

  const allColumns = [
    primaryProduct ? { ...primaryProduct, isPrimary: true } : null,
    ...competitors.map((c) => ({ ...c, isPrimary: false })),
  ].filter(Boolean);

  // Determine overall unit compatibility across displayed products
  const primaryUnit = primaryProduct?.quantityUnit || "g";
  const incompatibilityWarnings = competitors
    .map((c) => {
      const compCheck = checkUnitCompatibility(primaryUnit, c.quantityUnit);
      return !compCheck.isCompatible ? { brand: c.brand, warning: compCheck.warning } : null;
    })
    .filter(Boolean);

  return (
    <div className="space-y-4">
      {/* Table Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-ink-primary">
              Competitor Benchmark Matrix
            </h3>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-sand-light text-ink-primary border border-line-subtle">
              Market Research Engine
            </span>
          </div>
          <p className="text-xs text-ink-muted mt-0.5">
            Side-by-side comparison with deterministic price normalization and unit compatibility checks.
          </p>
        </div>

        {/* Highlight Filter */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-ink-muted text-[11px] font-medium hidden sm:inline">Highlight:</span>
          {["all", "pricing", "ingredients", "vulnerabilities"].map((mode) => (
            <button
              key={mode}
              onClick={() => setHighlightMetric(mode)}
              className={`px-2.5 py-1 rounded-lg text-xs capitalize transition-all ${
                highlightMetric === mode
                  ? "bg-terracotta text-ink-inverted font-semibold shadow-clay-sm"
                  : "bg-app-subtle text-ink-muted hover:text-ink-primary border border-line-subtle"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Unit Compatibility Callout */}
      {incompatibilityWarnings.length > 0 ? (
        <div className="p-3.5 rounded-xl bg-status-warning-bg border border-status-warning/30 text-xs text-status-warning flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block">Unit Incompatibility Warning:</span>
            {incompatibilityWarnings.map((w, idx) => (
              <span key={idx} className="block mt-0.5">
                • {w.brand}: {w.warning}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-sage-soft/60 border border-sage/30 text-xs text-sage-dark flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>
              <strong>Unit Compatibility Verified:</strong> All {allColumns.length} products in this category benchmark are measured in compatible mass units (50g).
            </span>
          </div>
          <span className="text-[11px] font-mono font-medium hidden md:inline">
            Direct ₹/g Comparison Enabled
          </span>
        </div>
      )}

      {/* Responsive Comparison Table */}
      <div className="overflow-x-auto rounded-2xl border border-line-subtle bg-app-card shadow-clay-sm">
        <table className="w-full text-left border-collapse text-xs">
          {/* Table Header: Product Names */}
          <thead>
            <tr className="border-b border-line-subtle bg-app-subtle/80">
              <th className="p-4 sm:p-5 w-44 min-w-[170px] text-[11px] font-mono uppercase text-ink-muted tracking-wider align-top">
                Feature / Dimension
              </th>
              {allColumns.map((col, idx) => {
                const isPrimary = col.isPrimary;
                return (
                  <th
                    key={col.id || idx}
                    className={`p-4 sm:p-5 min-w-[220px] max-w-[280px] align-top transition-colors ${
                      isPrimary
                        ? "bg-sand-light/50 border-x border-terracotta/30"
                        : "border-r border-line-subtle/50"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            isPrimary
                              ? "bg-terracotta text-ink-inverted"
                              : "bg-ink-primary text-ink-inverted"
                          }`}
                        >
                          {col.brand}
                        </span>
                        {isPrimary && (
                          <span className="text-[10px] font-semibold text-terracotta flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Primary Focus
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => onInspectEvidence(col)}
                          className="font-mono text-[11px] text-ink-muted hover:text-terracotta underline ml-auto"
                          title="Inspect evidence record"
                        >
                          [{col.evidenceId}]
                        </button>
                      </div>

                      <div className="font-serif text-base font-bold text-ink-primary leading-snug">
                        {col.productName}
                      </div>

                      <div className="text-[11px] text-ink-muted">
                        Category: {col.category}
                      </div>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-line-subtle/60">
            {/* Row 1: Retail Price */}
            {(highlightMetric === "all" || highlightMetric === "pricing") && (
              <tr className="hover:bg-app-subtle/40 transition-colors">
                <td className="p-4 sm:p-5 font-semibold text-ink-primary bg-app-subtle/30">
                  Retail Price (MRP)
                </td>
                {allColumns.map((col, idx) => (
                  <td
                    key={idx}
                    className={`p-4 sm:p-5 ${
                      col.isPrimary ? "bg-sand-light/30 border-x border-terracotta/20 font-semibold" : ""
                    }`}
                  >
                    {col.retailPriceINR ? (
                      <div>
                        <div className="text-base text-ink-primary font-bold">
                          ₹{col.retailPriceINR}
                        </div>
                        {col.discountedPriceINR && (
                          <div className="text-[11px] text-sage-dark font-medium">
                            Sale: ₹{col.discountedPriceINR}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-status-warning-bg text-status-warning text-[11px]">
                        Price Unknown
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            )}

            {/* Row 2: Pack Size */}
            <tr className="hover:bg-app-subtle/40 transition-colors">
              <td className="p-4 sm:p-5 font-semibold text-ink-primary bg-app-subtle/30">
                Pack Size
              </td>
              {allColumns.map((col, idx) => (
                <td
                  key={idx}
                  className={`p-4 sm:p-5 ${
                    col.isPrimary ? "bg-sand-light/30 border-x border-terracotta/20" : ""
                  }`}
                >
                  <span className="font-mono font-medium text-ink-primary text-xs">
                    {col.declaredNetQuantity || "Unknown"}
                  </span>
                </td>
              ))}
            </tr>

            {/* Row 3: Normalized Unit Price */}
            {(highlightMetric === "all" || highlightMetric === "pricing") && (
              <tr className="hover:bg-app-subtle/40 transition-colors bg-app-subtle/20">
                <td className="p-4 sm:p-5 font-semibold text-ink-primary bg-app-subtle/40">
                  <div>
                    <div>Normalized Price</div>
                    <span className="text-[10px] text-ink-muted font-normal block">
                      Deterministic per-unit calculation
                    </span>
                  </div>
                </td>
                {allColumns.map((col, idx) => {
                  const compCheck = checkUnitCompatibility(primaryUnit, col.quantityUnit);
                  return (
                    <td
                      key={idx}
                      className={`p-4 sm:p-5 ${
                        col.isPrimary ? "bg-sand-light/40 border-x border-terracotta/20" : ""
                      }`}
                    >
                      {col.pricePerUnit ? (
                        <div>
                          <div className="text-sm font-bold text-terracotta font-mono">
                            {col.unitMetricLabel || `₹${col.pricePerUnit} / ${col.quantityUnit}`}
                          </div>
                          {!compCheck.isCompatible && (
                            <div className="text-[10px] text-status-warning mt-1 leading-tight">
                              Requires density verification against {primaryUnit}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-[11px] text-ink-muted italic">
                          Calculable rate unknown
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            )}

            {/* Row 4: SPF / PA Rating */}
            <tr className="hover:bg-app-subtle/40 transition-colors">
              <td className="p-4 sm:p-5 font-semibold text-ink-primary bg-app-subtle/30">
                UV Protection Spec
              </td>
              {allColumns.map((col, idx) => (
                <td
                  key={idx}
                  className={`p-4 sm:p-5 ${
                    col.isPrimary ? "bg-sand-light/30 border-x border-terracotta/20" : ""
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded bg-sage-soft text-sage-dark font-mono text-[11px] font-bold">
                        {col.spfRating || "SPF Unknown"}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-sage-soft text-sage-dark font-mono text-[11px] font-bold">
                        {col.paRating || "PA Unknown"}
                      </span>
                    </div>
                    {col.testingStandard && (
                      <div className="text-[10px] text-ink-muted">
                        {col.testingStandard}
                      </div>
                    )}
                  </div>
                </td>
              ))}
            </tr>

            {/* Row 5: Key Active Ingredients */}
            {(highlightMetric === "all" || highlightMetric === "ingredients") && (
              <tr className="hover:bg-app-subtle/40 transition-colors">
                <td className="p-4 sm:p-5 font-semibold text-ink-primary bg-app-subtle/30 align-top">
                  Active Formulation Matrix
                </td>
                {allColumns.map((col, idx) => (
                  <td
                    key={idx}
                    className={`p-4 sm:p-5 align-top ${
                      col.isPrimary ? "bg-sand-light/30 border-x border-terracotta/20" : ""
                    }`}
                  >
                    <div className="flex flex-wrap gap-1">
                      {col.activeIngredients && col.activeIngredients.length > 0 ? (
                        col.activeIngredients.map((ing, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded bg-app-subtle text-ink-primary text-[11px] border border-line-subtle leading-tight"
                          >
                            {ing}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] text-ink-muted italic">
                          Formulation unlisted
                        </span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            )}

            {/* Row 6: Advertised Product Attributes */}
            <tr className="hover:bg-app-subtle/40 transition-colors">
              <td className="p-4 sm:p-5 font-semibold text-ink-primary bg-app-subtle/30 align-top">
                Advertised Claims & Finish
              </td>
              {allColumns.map((col, idx) => (
                <td
                  key={idx}
                  className={`p-4 sm:p-5 align-top ${
                    col.isPrimary ? "bg-sand-light/30 border-x border-terracotta/20" : ""
                  }`}
                >
                  <ul className="space-y-1 text-[11px] text-ink-primary">
                    {col.advertisedAttributes && col.advertisedAttributes.length > 0 ? (
                      col.advertisedAttributes.map((attr, aIdx) => (
                        <li key={aIdx} className="flex items-start gap-1">
                          <span className="text-terracotta">•</span>
                          <span>{attr}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-ink-muted italic">Attributes unstated</li>
                    )}
                  </ul>
                  {col.finish && (
                    <div className="mt-2 text-[11px] text-ink-muted italic">
                      Finish: {col.finish}
                    </div>
                  )}
                </td>
              ))}
            </tr>

            {/* Row 7: Consumer Rating */}
            <tr className="hover:bg-app-subtle/40 transition-colors">
              <td className="p-4 sm:p-5 font-semibold text-ink-primary bg-app-subtle/30">
                Verified Aggregate Rating
              </td>
              {allColumns.map((col, idx) => (
                <td
                  key={idx}
                  className={`p-4 sm:p-5 ${
                    col.isPrimary ? "bg-sand-light/30 border-x border-terracotta/20" : ""
                  }`}
                >
                  {col.sampleRating ? (
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center text-terracotta">
                        <Star className="w-4 h-4 fill-terracotta text-terracotta" />
                        <span className="font-bold text-sm text-ink-primary ml-1">
                          {col.sampleRating}
                        </span>
                      </div>
                      <span className="text-[10px] text-ink-muted">
                        / {col.ratingScale || "5.0"}
                      </span>
                    </div>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-app-subtle text-ink-muted text-[11px]">
                      Unverified
                    </span>
                  )}
                </td>
              ))}
            </tr>

            {/* Row 8: Consumer Vulnerability / Identified Flaw */}
            {(highlightMetric === "all" || highlightMetric === "vulnerabilities") && (
              <tr className="hover:bg-app-subtle/40 transition-colors bg-status-error-bg/20">
                <td className="p-4 sm:p-5 font-semibold text-status-error bg-status-error-bg/40 align-top">
                  <div className="flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>Observed Vulnerability</span>
                  </div>
                  <span className="text-[10px] text-ink-muted font-normal block mt-0.5">
                    Consumer feedback watchpoint
                  </span>
                </td>
                {allColumns.map((col, idx) => {
                  const flaw = col.identifiedFlaw || col.identifiedWatchpoint;
                  return (
                    <td
                      key={idx}
                      className={`p-4 sm:p-5 align-top ${
                        col.isPrimary ? "bg-sand-light/30 border-x border-terracotta/20" : ""
                      }`}
                    >
                      {flaw ? (
                        <div className="text-[11px] leading-relaxed text-ink-primary">
                          {flaw}
                        </div>
                      ) : (
                        <span className="text-[11px] text-ink-muted italic">
                          No flaws recorded
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            )}

            {/* Row 9: Source Provenance & Links */}
            <tr className="hover:bg-app-subtle/40 transition-colors">
              <td className="p-4 sm:p-5 font-semibold text-ink-primary bg-app-subtle/30">
                Data Provenance & Source
              </td>
              {allColumns.map((col, idx) => (
                <td
                  key={idx}
                  className={`p-4 sm:p-5 ${
                    col.isPrimary ? "bg-sand-light/30 border-x border-terracotta/20" : ""
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1 text-[11px] text-ink-muted">
                      <Clock className="w-3 h-3 text-ink-muted" />
                      <span>{col.collectedAt ? col.collectedAt.split("T")[0] : "Verified"}</span>
                    </div>

                    {col.sourceUrl ? (
                      <a
                        href={col.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-terracotta hover:underline font-medium text-[11px]"
                      >
                        <span>{col.sourcePlatform || "Public Listing"}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-[11px] text-ink-muted italic">
                        No link provided
                      </span>
                    )}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
