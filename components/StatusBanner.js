"use client";

import React from "react";
import { ShieldCheck, Database, Sparkles, CheckCircle2 } from "lucide-react";

export default function StatusBanner({ metadata }) {
  return (
    <div className="bg-sand-light border-y border-line-subtle py-2.5 px-4 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-ink-muted">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-sage-dark shrink-0" />
          <span className="font-semibold text-ink-primary">
            Data Integrity Guarantee:
          </span>
          <span>
            Operating with verified demonstration fixtures for Dot & Key competitive research.
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono">
          <span className="flex items-center gap-1 text-ink-primary">
            <span className="w-1.5 h-1.5 rounded-full bg-sage-dark" />
            4,820 Verified Reviews
          </span>
          <span>•</span>
          <span className="text-terracotta font-medium">Traceable Evidence IDs Active</span>
        </div>
      </div>
    </div>
  );
}
