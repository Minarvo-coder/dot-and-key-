"use client";

import React from "react";
import { useApp } from "@/components/AppContext";
import { ExternalLink } from "lucide-react";

export default function EvidenceBadge({ id, label, className = "" }) {
  const { openEvidence } = useApp();

  if (!id) return null;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        openEvidence(id);
      }}
      className={`inline-flex items-center gap-1 font-mono text-[11px] font-semibold tracking-wide px-2 py-0.5 rounded-md bg-sage-soft text-ink-primary hover:bg-terracotta hover:text-ink-inverted border border-line-subtle transition-all cursor-pointer select-none group shadow-sm ${className}`}
      title={`Inspect verified evidence [${id}]`}
    >
      <span>[{label || id}]</span>
      <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}
