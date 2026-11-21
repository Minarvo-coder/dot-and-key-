"use client";

import React from "react";
import { ExternalLink } from "lucide-react";
import { EVIDENCE_REVIEWS, COMPETITORS, PRODUCTS } from "@/data/researchFixtures";

export default function EvidenceBadge({ id, sourceUrl, className = "" }) {
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
  if (!url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1 font-mono text-xs font-semibold text-terracotta hover:underline ${className}`}
      title="View public source"
    >
      <span>View source</span>
      <ExternalLink className="w-3 h-3" />
    </a>
  );
}
