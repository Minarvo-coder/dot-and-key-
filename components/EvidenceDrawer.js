"use client";

import React, { useEffect } from "react";
import { X, ExternalLink, ShieldCheck, Star, Calendar, User, Tag } from "lucide-react";
import { useApp } from "@/components/AppContext";

export default function EvidenceDrawer({ evidence: propEvidence, isOpen: propIsOpen, onClose: propOnClose }) {
  const appContext = useApp();
  
  const evidence = propEvidence !== undefined ? propEvidence : appContext?.activeEvidence;
  const isOpen = propIsOpen !== undefined ? propIsOpen : appContext?.isEvidenceDrawerOpen;
  const onClose = propOnClose !== undefined ? propOnClose : appContext?.closeEvidence;

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" && isOpen && onClose) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !evidence) return null;

  const isReview = Boolean(evidence.verbatimQuote);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Evidence Record Inspector"
      className="fixed inset-0 z-50 flex justify-end bg-ink-primary/40 backdrop-blur-sm transition-opacity duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-app-card border-l border-line-subtle shadow-clay-lg h-full flex flex-col justify-between overflow-y-auto p-6 md:p-8 custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-line-subtle">
            <div>
              <span className="inline-block px-2.5 py-1 rounded bg-sage-soft text-sage-dark font-mono text-xs font-semibold uppercase tracking-wider mb-2 border border-sage/20">
                {evidence.id || evidence.evidenceId}
              </span>
              <h2 className="font-serif text-2xl text-ink-primary font-bold">
                {isReview ? "Customer Feedback Record" : "Product Specification Record"}
              </h2>
              <p className="text-xs text-ink-muted mt-1">
                Verifiable market intelligence record for Dot & Key competitive research
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close inspector drawer"
              className="p-2 text-ink-muted hover:text-ink-primary hover:bg-app-subtle rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-terracotta focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Record Details */}
          {isReview ? (
            <div className="space-y-5">
              {/* Product and Rating */}
              <div className="bg-app-subtle p-4 rounded-xl border border-line-subtle space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-terracotta uppercase tracking-wider">
                    {evidence.brand}
                  </span>
                  {evidence.rating && (
                    <div className="flex items-center gap-1 text-terracotta">
                      {Array.from({ length: evidence.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-terracotta text-terracotta" />
                      ))}
                      <span className="text-xs font-semibold text-ink-primary ml-1">
                        {evidence.rating}.0
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-sm font-semibold text-ink-primary">
                  {evidence.productName || evidence.product}
                </div>
                <div className="text-xs text-ink-muted">
                  Category: {evidence.category || "Verified Feedback"}
                </div>
              </div>

              {/* Verbatim Quote */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-ink-muted">
                  Verbatim Customer Excerpt
                </span>
                <blockquote className="p-4 bg-app-bg border-l-4 border-terracotta rounded-r-xl italic text-sm text-ink-primary leading-relaxed">
                  &ldquo;{evidence.verbatimQuote}&rdquo;
                </blockquote>
              </div>

              {/* Provenance Metadata */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-ink-muted">
                  Audited Provenance
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 bg-app-subtle rounded-lg border border-line-subtle flex items-center gap-2">
                    <User className="w-4 h-4 text-ink-muted shrink-0" />
                    <div className="min-w-0">
                      <div className="text-ink-muted text-[10px] uppercase">Reviewer</div>
                      <div className="font-medium text-ink-primary truncate">
                        {evidence.reviewer || "Verified Customer"}
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-app-subtle rounded-lg border border-line-subtle flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-ink-muted shrink-0" />
                    <div>
                      <div className="text-ink-muted text-[10px] uppercase">Date Ingested</div>
                      <div className="font-medium text-ink-primary">{evidence.date}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Platform Verification Tag */}
              <div className="p-3.5 rounded-lg bg-status-success-bg border border-sage/30 flex items-center justify-between text-xs text-status-success">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span className="font-medium">
                    {evidence.sourcePlatform || "Nykaa Verified Purchase"}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-sage-soft font-semibold text-[11px]">
                  Verified Buyer
                </span>
              </div>

              {/* Theme Tags */}
              {evidence.tags && evidence.tags.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-ink-muted">
                    Cluster Tags
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {evidence.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-app-subtle text-ink-primary border border-line-subtle"
                      >
                        <Tag className="w-3 h-3 text-ink-muted" />
                        {tag.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Product Spec Display */
            <div className="space-y-4">
              <div className="p-4 bg-app-subtle rounded-xl border border-line-subtle space-y-2">
                <div className="text-xs font-semibold text-terracotta uppercase">
                  {evidence.brand}
                </div>
                <div className="text-base font-serif text-ink-primary font-bold">
                  {evidence.productName}
                </div>
                <div className="text-xs text-ink-muted">{evidence.category}</div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-app-bg rounded-lg border border-line-subtle">
                  <span className="text-ink-muted block mb-0.5">Retail Price</span>
                  <span className="font-semibold text-base text-ink-primary">
                    ₹{evidence.retailPriceINR}
                  </span>
                  <span className="text-ink-muted block text-[11px]">
                    ({evidence.volumeML}ml volume)
                  </span>
                </div>
                <div className="p-3 bg-app-bg rounded-lg border border-line-subtle">
                  <span className="text-ink-muted block mb-0.5">Normalized Price</span>
                  <span className="font-semibold text-base text-ink-primary">
                    ₹{evidence.pricePerML} / ml
                  </span>
                  <span className="text-ink-muted block text-[11px]">Standardized metric</span>
                </div>
              </div>

              {evidence.activeIngredients && (
                <div className="space-y-2">
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-ink-muted">
                    Active Formulation Ingredients
                  </span>
                  <ul className="space-y-1 text-xs">
                    {evidence.activeIngredients.map((ing, i) => (
                      <li
                        key={i}
                        className="p-2 bg-app-subtle rounded border border-line-subtle text-ink-primary"
                      >
                        {ing}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {evidence.verifiedClaims && (
                <div className="space-y-2">
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-ink-muted">
                    Verified Package Claims
                  </span>
                  <ul className="space-y-1 text-xs">
                    {evidence.verifiedClaims.map((claim, i) => (
                      <li
                        key={i}
                        className="p-2 bg-status-success-bg text-status-success rounded border border-sage/30 flex items-center gap-1.5"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                        {claim}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {evidence.sourceUrl && (
                <a
                  href={evidence.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-terracotta hover:text-terracotta-hover transition-colors underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View Original Retail Listing
                </a>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-6 mt-6 border-t border-line-subtle flex items-center justify-between">
          <span className="text-[11px] text-ink-muted">
            Data Integrity: Audited Research Fixture
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium rounded-lg bg-ink-primary text-ink-inverted hover:bg-black transition-colors focus-visible:ring-2 focus-visible:ring-terracotta"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
