"use client";

import React, { useState } from "react";
import { useApp } from "@/components/AppContext";
import { BRAND_VOICE_GUIDELINES } from "@/data/researchFixtures";
import {
  Feather,
  CheckCircle,
  XCircle,
  Globe,
  Sparkles,
  ArrowRight,
  BookOpen,
  Volume2,
} from "lucide-react";

export default function BrandVoicePage() {
  const { selectedLanguage, setSelectedLanguage } = useApp();
  const [activeLangTab, setActiveLangTab] = useState(selectedLanguage || "English");

  const { pillars, vocabularyRules, multilingualGuidelines, transformations } =
    BRAND_VOICE_GUIDELINES;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line-subtle">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase font-bold text-terracotta">
              TOOLS & SETTINGS
            </span>
            <span className="text-ink-muted text-xs">•</span>
            <span className="text-xs text-ink-muted">Editorial Guidelines</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink-primary">
            Dot & Key Brand Voice & Copy Standards
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted mt-0.5">
            Core editorial pillars, multilingual guidelines, vocabulary constraints, and before/after copy transformations.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sand-light text-ink-primary border border-line-subtle font-mono">
            Clay & Ink Aesthetic
          </span>
        </div>
      </div>

      {/* 1. Core Brand Voice Pillars */}
      <div className="space-y-4">
        <h2 className="font-serif text-xl font-bold text-ink-primary">
          Core Voice Pillars
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {pillars.map((pillar, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-app-card border border-line-subtle shadow-clay-sm space-y-2 flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-xs font-bold text-terracotta block mb-1">
                  Pillar 0{i + 1}
                </span>
                <h3 className="font-serif text-base font-bold text-ink-primary">
                  {pillar.title}
                </h3>
              </div>
              <p className="text-xs text-ink-muted leading-relaxed pt-2 border-t border-line-subtle/50">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Vocabulary Rules (Dos and Don'ts) */}
      <div className="p-6 rounded-2xl bg-app-card border border-line-subtle shadow-clay-sm space-y-5">
        <h2 className="font-serif text-xl font-bold text-ink-primary">
          Vocabulary Standards: Words to Embrace vs Strictly Avoid
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Words to Use */}
          <div className="p-5 rounded-xl bg-status-success-bg/40 border border-sage/30 space-y-3">
            <div className="flex items-center gap-2 text-status-success font-bold text-xs uppercase tracking-wider">
              <CheckCircle className="w-4 h-4" />
              <span>Recommended Vocabulary (Embrace)</span>
            </div>
            <ul className="space-y-2 text-xs">
              {vocabularyRules.wordsToUse.map((word, i) => (
                <li
                  key={i}
                  className="p-2 rounded-lg bg-app-card border border-sage/20 text-ink-primary flex items-center gap-2 font-medium"
                >
                  <span className="text-status-success font-bold">✓</span>
                  <span>&ldquo;{word}&rdquo;</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Words to Avoid */}
          <div className="p-5 rounded-xl bg-status-error-bg/40 border border-status-error/20 space-y-3">
            <div className="flex items-center gap-2 text-status-error font-bold text-xs uppercase tracking-wider">
              <XCircle className="w-4 h-4" />
              <span>Prohibited Terms & Patterns (Avoid)</span>
            </div>
            <ul className="space-y-2 text-xs">
              {vocabularyRules.wordsToAvoid.map((word, i) => (
                <li
                  key={i}
                  className="p-2 rounded-lg bg-app-card border border-status-error/20 text-ink-primary flex items-center gap-2 font-medium"
                >
                  <span className="text-status-error font-bold">✕</span>
                  <span>&ldquo;{word}&rdquo;</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 3. Multilingual Nuances */}
      <div className="p-6 rounded-2xl bg-app-card border border-line-subtle shadow-clay-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-line-subtle">
          <div>
            <h2 className="font-serif text-xl font-bold text-ink-primary">
              Multilingual Adaptation Guidelines
            </h2>
            <p className="text-xs text-ink-muted">
              Nuances across English, Hindi, Bengali, and Hinglish for subcontinental resonance
            </p>
          </div>

          {/* Lang Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {Object.keys(multilingualGuidelines).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setActiveLangTab(lang)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeLangTab === lang
                    ? "bg-terracotta text-ink-inverted font-semibold shadow-clay-sm"
                    : "bg-app-subtle text-ink-muted hover:text-ink-primary"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Language Card */}
        <div className="p-5 rounded-xl bg-app-subtle border border-line-subtle space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-terracotta">
              {activeLangTab} Language Profile
            </span>
          </div>
          <p className="text-xs text-ink-primary leading-relaxed font-medium">
            {multilingualGuidelines[activeLangTab].tone}
          </p>
          <div className="p-3.5 rounded-lg bg-app-card border border-line-subtle space-y-1">
            <span className="text-[10px] font-mono uppercase text-ink-muted block font-semibold">
              Sample Brand Tagline
            </span>
            <div className="font-serif text-base font-bold text-ink-primary">
              &ldquo;{multilingualGuidelines[activeLangTab].exampleTagline}&rdquo;
            </div>
          </div>
        </div>
      </div>

      {/* 4. Copy Transformation: Clinical Pharma vs Dot & Key Voice */}
      <div className="p-6 rounded-2xl bg-app-card border border-line-subtle shadow-clay-sm space-y-5">
        <h2 className="font-serif text-xl font-bold text-ink-primary">
          Voice Transformation: Clinical Pharma into Dot & Key Joy
        </h2>

        <div className="space-y-3">
          {transformations.map((trans, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-app-subtle border border-line-subtle grid grid-cols-1 md:grid-cols-2 gap-4 text-xs"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase font-bold text-status-error block">
                  Cold Clinical Pharma Draft (Avoid)
                </span>
                <p className="italic text-ink-muted bg-app-card p-3 rounded-lg border border-line-subtle">
                  &ldquo;{trans.clinical}&rdquo;
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase font-bold text-status-success block">
                  Dot & Key Editorial Standard (Embrace)
                </span>
                <p className="font-semibold text-ink-primary bg-status-success-bg/50 p-3 rounded-lg border border-sage/20">
                  &ldquo;{trans.dotKeyVoice}&rdquo;
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
