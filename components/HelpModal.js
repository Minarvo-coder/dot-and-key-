"use client";

import React, { useEffect } from "react";
import { useApp } from "@/components/AppContext";
import {
  X,
  HelpCircle,
  FileCheck,
  Compass,
  Palette,
  ShieldCheck,
  BookOpen,
  CheckCircle,
} from "lucide-react";

export default function HelpModal() {
  const { isHelpModalOpen, setIsHelpModalOpen } = useApp();

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" && isHelpModalOpen) {
        setIsHelpModalOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isHelpModalOpen, setIsHelpModalOpen]);

  if (!isHelpModalOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Help and Documentation"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-primary/50 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={() => setIsHelpModalOpen(false)}
    >
      <div
        className="w-full max-w-2xl bg-app-card rounded-2xl border border-line-subtle shadow-clay-lg max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-line-subtle bg-app-subtle/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-terracotta/10 text-terracotta flex items-center justify-center font-bold">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-ink-primary">
                Help & System Documentation
              </h2>
              <span className="text-[11px] text-ink-muted">
                KAIROS | Proof2Pitch AI User Guide
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsHelpModalOpen(false)}
            className="p-1.5 rounded-lg text-ink-muted hover:text-ink-primary hover:bg-app-subtle transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-ink-muted custom-scrollbar">
          {/* Section 1: Overview */}
          <div className="space-y-2">
            <h3 className="font-serif text-base font-bold text-ink-primary flex items-center gap-2">
              <Compass className="w-4 h-4 text-terracotta" />
              <span>1. Market Intelligence That Creates Marketing</span>
            </h3>
            <p className="leading-relaxed text-ink-primary/80">
              KAIROS bridges the gap between deep retail customer audits and creative content production. Instead of generic AI copywriting, every marketing claim, Instagram caption, and storyboard scene is anchored directly to verified buyer feedback, competitor formulation defects, and instrumental product claims.
            </p>
          </div>

          {/* Section 2: Traceable Evidence IDs */}
          <div className="space-y-2.5 p-4 rounded-xl bg-app-subtle border border-line-subtle">
            <h3 className="font-serif text-sm font-bold text-ink-primary flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sage-dark" />
              <span>2. Traceable Evidence Badges (Source links)</span>
            </h3>
            <p className="leading-relaxed">
              Whenever you encounter a monospace badge like <span className="font-mono px-1.5 py-0.5 rounded bg-sage-soft text-ink-primary border border-line-subtle font-semibold">View source</span>, clicking it opens the slide-over Evidence Inspector. This reveals the actual verbatim customer review, platform source (Nykaa, Amazon), reviewer city, date, and sentiment cluster.
            </p>
          </div>

          {/* Section 3: Clay & Ink Design Standard */}
          <div className="space-y-2">
            <h3 className="font-serif text-sm font-bold text-ink-primary flex items-center gap-2">
              <Palette className="w-4 h-4 text-sand" />
              <span>3. Clay & Ink Materiality</span>
            </h3>
            <p className="leading-relaxed">
              The application uses luxury editorial paper tones designed for extended growth marketer sessions:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
              <div className="p-2 rounded-lg bg-[#EDE6DD] border border-line-subtle text-ink-primary">
                <span className="block font-bold">#EDE6DD</span>
                <span className="text-[10px] text-ink-muted">Clay Canvas</span>
              </div>
              <div className="p-2 rounded-lg bg-[#F8F3EC] border border-line-subtle text-ink-primary">
                <span className="block font-bold">#F8F3EC</span>
                <span className="text-[10px] text-ink-muted">Paper Card</span>
              </div>
              <div className="p-2 rounded-lg bg-terracotta text-ink-inverted">
                <span className="block font-bold">#B4532A</span>
                <span className="text-[10px] text-ink-inverted/80">Terracotta Accent</span>
              </div>
              <div className="p-2 rounded-lg bg-sage-soft text-sage-dark border border-sage/30">
                <span className="block font-bold">#6B7F73</span>
                <span className="text-[10px] text-sage-dark/80">Sage Positive</span>
              </div>
            </div>
          </div>

          {/* Section 4: Workflow Steps */}
          <div className="space-y-2">
            <h3 className="font-serif text-sm font-bold text-ink-primary flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-terracotta" />
              <span>4. Recommended Product-to-Content Workflow</span>
            </h3>
            <ol className="space-y-2 list-decimal list-inside pl-1 text-ink-primary/90">
              <li>
                <strong>Product Library (/products):</strong> Select or analyze your active Dot & Key product.
              </li>
              <li>
                <strong>Competitor Analysis (/competitors):</strong> Review the normalized 5-competitor benchmark matrix and vulnerability cards.
              </li>
              <li>
                <strong>Review Insights (/reviews):</strong> Inspect verified sentiment drivers and customer love vs complaints.
              </li>
              <li>
                <strong>Market Opportunities (/opportunities):</strong> Select a high-conviction angle and launch directly into the studio.
              </li>
              <li>
                <strong>Marketing Studio (/marketing-studio):</strong> Generate Instagram copy, product descriptions, A+ content, ad scripts, 6-frame storyboards, and video concepts across 4 languages.
              </li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-line-subtle bg-app-subtle/30 flex items-center justify-between">
          <span className="text-[11px] text-ink-muted font-mono">
            Version 2.0 • Phase 2 Production
          </span>
          <button
            type="button"
            onClick={() => setIsHelpModalOpen(false)}
            className="px-4 py-2 rounded-xl bg-terracotta text-ink-inverted text-xs font-semibold hover:bg-terracotta-hover transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
