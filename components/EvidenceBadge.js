"use client";

import React from "react";
import { ExternalLink } from "lucide-react";
import { useApp } from "@/components/AppContext";
import { EVIDENCE_REVIEWS, COMPETITORS, PRODUCTS } from "@/data/researchFixtures";

export default function EvidenceBadge({ id, sourceUrl, className = "" }) {
  const { openEvidence } = useApp();
  let url = sourceUrl;

  if (!url && id) {
    const rev = EVIDENCE_REVIEWS?.find((r) => r.id === id || r.evidenceId === id);
    if (rev?.sourceUrl || rev?.url) url = rev.sourceUrl || rev.url;

    if (!url) {
      const comp = COMPETITORS?.find((c) => c.id === id || c.evidenceId === id);
      if (comp?.sourceUrl || comp?.url) url = comp.sourceUrl || comp.url;
    }

    if (!url) {
      const prod = PRODUCTS?.find((p) => p.id === id || p.evidenceId === id);
      if (prod?.sourceUrl || prod?.url) url = prod.sourceUrl || prod.url;
    }
  }

  // Where a source exists, show a "View source" link. Where none exists, show nothing.
  if (!url && !id) return null;

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {id && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (openEvidence) openEvidence(id);
          }}
          className="text-xs font-mono font-semibold text-terracotta hover:underline cursor-pointer"
        >
          Inspect Review
        </button>
      )}
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-mono text-xs font-medium text-ink-muted hover:text-terracotta hover:underline"
          title="View public source"
        >
          <span>Source</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </div>
  );
}
