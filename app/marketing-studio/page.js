"use client";

import React, { useState } from "react";
import { useApp } from "@/components/AppContext";
import EvidenceBadge from "@/components/EvidenceBadge";
import {
  PenTool,
  Copy,
  Check,
  Download,
  Sparkles,
  FileText,
  Layers,
  Film,
  Clapperboard,
  Video,
  ShieldCheck,
  CheckCircle,
  ExternalLink,
  Users,
  Compass,
} from "lucide-react";

function InstagramIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );
}

export default function MarketingStudioPage() {
  const {
    selectedProduct,
    creativeFixtures,
    activeAngleId,
    setActiveAngleId,
    selectedAudienceId,
    setSelectedAudienceId,
    selectedLanguage,
    addExportRecord,
    openEvidence,
  } = useApp();

  const [activeTab, setActiveTab] = useState("captions"); // 'captions', 'description', 'aplus', 'script', 'storyboard', 'video'
  const [copiedKey, setCopiedKey] = useState(null);
  const [exportNotice, setExportNotice] = useState(false);

  const { audiences, marketingAngles, campaignOutputs } = creativeFixtures;

  // Retrieve campaign output based on selected angle and audience
  const currentAngleOutputs =
    campaignOutputs[activeAngleId] || campaignOutputs["monsoon-barrier"];
  const currentData =
    currentAngleOutputs[selectedAudienceId] || currentAngleOutputs["gen-z"];

  const activeAngle =
    marketingAngles.find((a) => a.id === activeAngleId) || marketingAngles[0];
  const activeAudience =
    audiences.find((a) => a.id === selectedAudienceId) || audiences[0];

  function handleCopy(text, key) {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  }

  function handleExportMarkdown() {
    const mdContent = `# KAIROS Market Intelligence Studio — Campaign Asset Package
## Product: ${selectedProduct.productName} (${selectedProduct.brand})
**Retail Price:** ₹${selectedProduct.retailPriceINR} (${selectedProduct.volumeML}ml) | Standardized: ₹${selectedProduct.pricePerML}/ml
**Strategic Angle:** ${activeAngle.name}
**Target Audience:** ${activeAudience.label}
**Target Language:** ${selectedLanguage}
**Generated Date:** ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}

---

## 1. Instagram Captions (3 Angles)
${currentData.instagramCaptions
  .map(
    (c, i) => `### Caption Option ${i + 1}: ${c.title}
**Hook:** ${c.hook}

**Body:** ${c.body}

**Call To Action:** ${c.cta}
**Hashtags:** ${c.hashtags}
**Tone:** ${c.tone}
**Grounding Evidence:** [${c.evidence}]
`
  )
  .join("\n")}

---

## 2. E-Commerce Product Description (PDP)
**Headline:** ${currentData.productDescription.headline}
**Tagline:** ${currentData.productDescription.tagline}

**Editorial Body:**
${currentData.productDescription.editorialBody}

**Hero Actives:** ${currentData.productDescription.activesHighlight}
**Sensory Finish:** ${currentData.productDescription.sensoryFinish}
**Compliance Disclaimer:** ${currentData.productDescription.complianceDisclaimer}

---

## 3. Enhanced Brand Content (A+ Listing)
**Hero Headline:** ${currentData.aPlusListing.heroHeadline}
**Brand Story:** ${currentData.aPlusListing.brandStory}

**Feature Bullet Points:**
${currentData.aPlusListing.bulletPoints.map((b) => `- ${b}`).join("\n")}

**Competitor Benchmarking Matrix:**
${currentData.aPlusListing.competitorComparison
  .map((m) => `- ${m.feature}: Dot & Key (${m.dotKey}) vs Competitors (${m.competitor})`)
  .join("\n")}

**Compliance:** ${currentData.aPlusListing.complianceDisclaimer}

---

## 4. 30-Second Commercial Ad Script
| Scene | Time | Visual Action | Spoken Audio | On-Screen Text | Evidence |
|---|---|---|---|---|---|
${currentData.adScript30s
  .map(
    (s) =>
      `| ${s.sceneNumber} | ${s.timeCode} | ${s.visualAction} | ${s.audioVoiceover} | ${s.onScreenText} | [${s.evidenceTag}] |`
  )
  .join("\n")}

---

## 5. Six-Frame Video Storyboard
${currentData.sixFrameStoryboard
  .map(
    (f) => `### Frame ${f.frameNumber}: ${f.sceneTitle}
- **Visual Action:** ${f.visualAction}
- **Spoken Audio:** ${f.spokenAudio}
- **On-Screen Text:** ${f.onScreenText}
- **Traceable Evidence Citation:** [${f.evidenceTag}]
`
  )
  .join("\n")}

---

## 6. Promo Video Creative Brief & Concept
**Concept Title:** ${currentData.promoVideoConcept.conceptTitle}
**Core Metaphor:** ${currentData.promoVideoConcept.coreMetaphor}
**Creative Hook:** ${currentData.promoVideoConcept.creativeHook}
**Target Persona:** ${currentData.promoVideoConcept.targetPersona}
**Key Benefit:** ${currentData.promoVideoConcept.keyBenefit}
**Audio Direction:** ${currentData.promoVideoConcept.audioDirection}
**Call To Action:** ${currentData.promoVideoConcept.callToAction}
**Evidence Provenance:** ${currentData.promoVideoConcept.evidenceProvenance}

---
*Generated by KAIROS / Proof2Pitch AI for Dot & Key Skincare Intelligence. All claims verified by retail audits.*
`;

    const blob = new Blob([mdContent], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const filename = `dot-and-key-${activeAngleId}-${selectedAudienceId}-campaign.md`;
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Add to export history
    addExportRecord({
      title: `${selectedProduct.productName} — ${activeAngle.name} Package`,
      angleName: activeAngle.name,
      audienceLabel: activeAudience.label,
      format: "Markdown (.md)",
      size: `${(blob.size / 1024).toFixed(1)} KB`,
      status: "Completed",
      downloadFileName: filename,
    });

    setExportNotice(true);
    setTimeout(() => {
      setExportNotice(false);
    }, 3500);
  }

  const contentTabs = [
    { id: "captions", label: "Instagram Captions", icon: InstagramIcon, count: "3 Angles" },
    { id: "description", label: "Product Description", icon: FileText, count: "PDP Copy" },
    { id: "aplus", label: "A+ Listing", icon: Layers, count: "E-Commerce" },
    { id: "script", label: "30s Ad Script", icon: Clapperboard, count: "5 Scenes" },
    { id: "storyboard", label: "Six-Frame Storyboard", icon: Film, count: "6 Frames" },
    { id: "video", label: "Promo Video Concept", icon: Video, count: "Creative Brief" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line-subtle">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase font-bold text-terracotta">
              CONTENT CREATION
            </span>
            <span className="text-ink-muted text-xs">•</span>
            <span className="text-xs text-ink-muted">Evidence-Grounded Generator</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink-primary">
            Marketing Campaign Studio
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted mt-0.5">
            Produce six verified marketing content formats for{" "}
            <span className="font-semibold text-ink-primary">{selectedProduct.productName}</span>.
          </p>
        </div>

        {/* Global Export CTA */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleExportMarkdown}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-terracotta text-ink-inverted text-xs font-semibold hover:bg-terracotta-hover transition-all shadow-clay-sm"
          >
            <Download className="w-4 h-4" />
            <span>Export Campaign Package (.md)</span>
          </button>
        </div>
      </div>

      {/* Export Confirmation Banner */}
      {exportNotice && (
        <div className="p-4 rounded-xl bg-status-success-bg border border-sage/40 flex items-center justify-between gap-3 text-xs text-status-success shadow-clay-sm animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>
              Campaign package downloaded and logged into your <strong>Export History</strong>!
            </span>
          </div>
          <span className="text-[10px] font-mono uppercase font-bold">SAVED</span>
        </div>
      )}

      {/* Strategic Controls: Angle & Audience Selectors */}
      <div className="p-5 sm:p-6 rounded-2xl bg-app-card border border-line-subtle shadow-clay-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-line-subtle">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted block">
              Active Strategy Anchor
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-serif text-base font-bold text-ink-primary">
                {activeAngle.name}
              </span>
              <span className="text-xs text-ink-muted">•</span>
              <span className="text-xs font-medium text-terracotta">
                {activeAudience.label}
              </span>
            </div>
          </div>

          <div className="text-xs font-mono text-ink-muted bg-app-subtle px-3 py-1.5 rounded-xl border border-line-subtle">
            Generating copy formatted for:{" "}
            <span className="font-bold text-ink-primary">{selectedLanguage}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Angle Selector */}
          <div className="space-y-2">
            <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-ink-muted block">
              1. Selected Marketing Opportunity Angle
            </label>
            <div className="flex flex-col gap-2">
              {marketingAngles.map((angle) => {
                const isSelected = activeAngleId === angle.id;
                return (
                  <button
                    key={angle.id}
                    type="button"
                    onClick={() => setActiveAngleId(angle.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "border-terracotta bg-terracotta/5 ring-1 ring-terracotta shadow-clay-sm"
                        : "border-line-subtle bg-app-subtle hover:bg-app-card"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-ink-primary">
                        {angle.name}
                      </span>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-terracotta shrink-0" />
                      )}
                    </div>
                    <span className="text-[11px] text-ink-muted block mt-0.5">
                      &ldquo;{angle.headline}&rdquo;
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Audience Selector */}
          <div className="space-y-2">
            <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-ink-muted block">
              2. Target Demographic Persona
            </label>
            <div className="flex flex-col gap-2">
              {audiences.map((aud) => {
                const isSelected = selectedAudienceId === aud.id;
                return (
                  <button
                    key={aud.id}
                    type="button"
                    onClick={() => setSelectedAudienceId(aud.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "border-terracotta bg-terracotta/5 ring-1 ring-terracotta shadow-clay-sm"
                        : "border-line-subtle bg-app-subtle hover:bg-app-card"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-ink-primary">
                        {aud.label}
                      </span>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-terracotta shrink-0" />
                      )}
                    </div>
                    <span className="text-[11px] text-ink-muted block mt-0.5">
                      {aud.focusText}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Internal Navigation Tabs for 6 Content Types */}
      <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar border-b border-line-subtle pb-2">
        {contentTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? "bg-terracotta text-ink-inverted font-bold shadow-clay-sm"
                  : "bg-app-card text-ink-muted hover:text-ink-primary border border-line-subtle hover:bg-app-subtle"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                  isActive
                    ? "bg-terracotta-hover text-ink-inverted"
                    : "bg-app-subtle text-ink-muted"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Three Instagram Captions */}
      {activeTab === "captions" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-ink-primary">
                Three Distinct Instagram Captions
              </h2>
              <p className="text-xs text-ink-muted">
                Engineered with high-converting hooks, relatable pacing, and verifiable review citations
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {currentData.instagramCaptions.map((cap, i) => {
              const fullCaptionText = `${cap.hook}\n\n${cap.body}\n\n${cap.cta}\n\n${cap.hashtags}`;
              const isCopied = copiedKey === `cap-${i}`;

              return (
                <div
                  key={cap.id}
                  className="p-5 sm:p-6 rounded-2xl bg-app-card border border-line-subtle shadow-clay-sm flex flex-col justify-between space-y-4 hover:border-line-strong transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 pb-2 border-b border-line-subtle">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-terracotta px-2 py-0.5 rounded bg-terracotta/10">
                        Option 0{i + 1}: {cap.title}
                      </span>
                      <EvidenceBadge id={cap.evidence} />
                    </div>

                    {/* Hook */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono uppercase font-bold text-ink-muted block">
                        Hook
                      </span>
                      <p className="text-xs font-bold text-ink-primary leading-snug">
                        {cap.hook}
                      </p>
                    </div>

                    {/* Body */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono uppercase font-bold text-ink-muted block">
                        Caption Body
                      </span>
                      <p className="text-xs text-ink-muted leading-relaxed whitespace-pre-line">
                        {cap.body}
                      </p>
                    </div>

                    {/* CTA */}
                    <div className="space-y-1 text-xs">
                      <span className="text-[10px] font-mono uppercase font-bold text-ink-muted block">
                        Call to Action
                      </span>
                      <p className="font-medium text-terracotta">{cap.cta}</p>
                    </div>

                    {/* Hashtags */}
                    <div className="text-[11px] text-ink-muted font-mono leading-relaxed bg-app-subtle p-2.5 rounded-lg border border-line-subtle">
                      {cap.hashtags}
                    </div>

                    {/* Tone Note */}
                    <div className="text-[10px] text-ink-muted">
                      <strong>Tone:</strong> {cap.tone}
                    </div>
                  </div>

                  {/* Copy Button */}
                  <div className="pt-3 border-t border-line-subtle">
                    <button
                      type="button"
                      onClick={() => handleCopy(fullCaptionText, `cap-${i}`)}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        isCopied
                          ? "bg-status-success text-ink-inverted"
                          : "bg-app-subtle text-ink-primary hover:bg-terracotta hover:text-ink-inverted border border-line-subtle"
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Caption</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Product Description */}
      {activeTab === "description" && (
        <div className="p-6 sm:p-8 rounded-2xl bg-app-card border border-line-subtle shadow-clay-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-line-subtle">
            <div>
              <h2 className="font-serif text-xl font-bold text-ink-primary">
                E-Commerce Product Description (PDP)
              </h2>
              <p className="text-xs text-ink-muted">
                Editorial title, rich formula story, active breakdown, and compliance disclaimer
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                handleCopy(
                  `${currentData.productDescription.headline}\n${currentData.productDescription.tagline}\n\n${currentData.productDescription.editorialBody}\n\nActives: ${currentData.productDescription.activesHighlight}\nFinish: ${currentData.productDescription.sensoryFinish}\n\n${currentData.productDescription.complianceDisclaimer}`,
                  "pdp-copy"
                )
              }
              className={`px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-all ${
                copiedKey === "pdp-copy"
                  ? "bg-status-success text-ink-inverted"
                  : "bg-app-subtle text-ink-primary hover:bg-terracotta hover:text-ink-inverted border border-line-subtle"
              }`}
            >
              {copiedKey === "pdp-copy" ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Full PDP Description</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-4 max-w-4xl text-xs">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted block mb-1">
                Headline & Tagline
              </span>
              <h3 className="font-serif text-2xl font-bold text-ink-primary">
                {currentData.productDescription.headline}
              </h3>
              <p className="text-sm font-medium text-terracotta mt-1">
                {currentData.productDescription.tagline}
              </p>
            </div>

            <div className="space-y-1.5 pt-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted block">
                Editorial Product Body
              </span>
              <p className="text-xs text-ink-primary leading-relaxed bg-app-subtle p-4 rounded-xl border border-line-subtle whitespace-pre-line">
                {currentData.productDescription.editorialBody}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-app-subtle border border-line-subtle space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted block">
                  Active Formulation Highlights
                </span>
                <p className="font-medium text-ink-primary leading-relaxed">
                  {currentData.productDescription.activesHighlight}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-app-subtle border border-line-subtle space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted block">
                  Sensory Application & Finish
                </span>
                <p className="font-medium text-ink-primary leading-relaxed">
                  {currentData.productDescription.sensoryFinish}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-sand-light/50 border border-line-subtle flex items-start gap-2.5 text-[11px] text-ink-muted">
              <ShieldCheck className="w-4 h-4 text-sage-dark shrink-0 mt-0.5" />
              <span>
                <strong>Compliance & Audit Note:</strong>{" "}
                {currentData.productDescription.complianceDisclaimer}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: A+ Listing */}
      {activeTab === "aplus" && (
        <div className="p-6 sm:p-8 rounded-2xl bg-app-card border border-line-subtle shadow-clay-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-line-subtle">
            <div>
              <h2 className="font-serif text-xl font-bold text-ink-primary">
                Amazon / Nykaa A+ Enhanced Content
              </h2>
              <p className="text-xs text-ink-muted">
                Modular e-commerce brand story, feature bullets, and competitor comparison highlights
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                handleCopy(
                  `${currentData.aPlusListing.heroHeadline}\n\n${currentData.aPlusListing.brandStory}\n\nFeature Bullets:\n${currentData.aPlusListing.bulletPoints.join("\n")}\n\n${currentData.aPlusListing.complianceDisclaimer}`,
                  "aplus-copy"
                )
              }
              className={`px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-all ${
                copiedKey === "aplus-copy"
                  ? "bg-status-success text-ink-inverted"
                  : "bg-app-subtle text-ink-primary hover:bg-terracotta hover:text-ink-inverted border border-line-subtle"
              }`}
            >
              {copiedKey === "aplus-copy" ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy A+ Content</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-6 text-xs">
            {/* Brand Story Banner */}
            <div className="p-5 rounded-2xl bg-app-subtle border border-line-subtle space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-terracotta">
                Brand Story Module
              </span>
              <h3 className="font-serif text-xl font-bold text-ink-primary">
                {currentData.aPlusListing.heroHeadline}
              </h3>
              <p className="text-ink-muted leading-relaxed">
                {currentData.aPlusListing.brandStory}
              </p>
            </div>

            {/* Bullet Points */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted block">
                Key Selling Feature Bullets
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentData.aPlusListing.bulletPoints.map((bp, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-app-subtle border border-line-subtle text-xs text-ink-primary leading-relaxed flex items-start gap-2.5"
                  >
                    <CheckCircle className="w-4 h-4 text-status-success shrink-0 mt-0.5" />
                    <span>{bp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Comparison Highlights */}
            {currentData.aPlusListing.competitorComparison && (
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted block">
                  A+ Comparison Chart Highlight
                </span>
                <div className="overflow-x-auto rounded-xl border border-line-subtle">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-app-subtle border-b border-line-subtle text-[11px] font-mono text-ink-muted uppercase">
                        <th className="p-3">Performance Dimension</th>
                        <th className="p-3 bg-terracotta/10 text-terracotta font-bold">
                          Dot & Key (Subject)
                        </th>
                        <th className="p-3">Generic / Competitor Standard</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line-subtle">
                      {currentData.aPlusListing.competitorComparison.map((row, i) => (
                        <tr key={i} className="hover:bg-app-subtle/40">
                          <td className="p-3 font-semibold text-ink-primary">{row.feature}</td>
                          <td className="p-3 font-bold text-terracotta bg-terracotta/5">
                            {row.dotKey}
                          </td>
                          <td className="p-3 text-ink-muted">{row.competitor}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: 30-Second Ad Script */}
      {activeTab === "script" && (
        <div className="p-6 sm:p-8 rounded-2xl bg-app-card border border-line-subtle shadow-clay-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-line-subtle">
            <div>
              <h2 className="font-serif text-xl font-bold text-ink-primary">
                30-Second Commercial Ad Script
              </h2>
              <p className="text-xs text-ink-muted">
                Timed 5-scene audio/visual production table with on-screen text and verified review citations
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                handleCopy(
                  currentData.adScript30s
                    .map(
                      (s) =>
                        `Scene ${s.sceneNumber} (${s.timeCode})\nVisual: ${s.visualAction}\nAudio: ${s.audioVoiceover}\nText: ${s.onScreenText}\nEvidence: [${s.evidenceTag}]\n`
                    )
                    .join("\n"),
                  "script-copy"
                )
              }
              className={`px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-all ${
                copiedKey === "script-copy"
                  ? "bg-status-success text-ink-inverted"
                  : "bg-app-subtle text-ink-primary hover:bg-terracotta hover:text-ink-inverted border border-line-subtle"
              }`}
            >
              {copiedKey === "script-copy" ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Complete Script</span>
                </>
              )}
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-line-subtle custom-scrollbar">
            <table className="w-full text-left border-collapse text-xs min-w-[700px]">
              <thead>
                <tr className="bg-app-subtle border-b border-line-subtle text-[11px] font-mono uppercase text-ink-muted">
                  <th className="py-3 px-3.5 w-24">Timing</th>
                  <th className="py-3 px-4 w-72">Visual & Camera Action</th>
                  <th className="py-3 px-4">Spoken Voiceover</th>
                  <th className="py-3 px-4 w-52">On-Screen Text & Citation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line-subtle">
                {currentData.adScript30s.map((scene) => (
                  <tr key={scene.sceneNumber} className="hover:bg-app-subtle/50 transition-colors">
                    <td className="py-3.5 px-3.5 font-mono text-[11px] font-bold text-terracotta align-top">
                      <div>Scene {scene.sceneNumber}</div>
                      <div className="text-ink-muted font-normal text-[10px]">{scene.timeCode}</div>
                    </td>
                    <td className="py-3.5 px-4 text-ink-primary align-top leading-relaxed">
                      {scene.visualAction}
                    </td>
                    <td className="py-3.5 px-4 italic text-ink-primary align-top leading-relaxed bg-app-subtle/30">
                      {scene.audioVoiceover}
                    </td>
                    <td className="py-3.5 px-4 align-top space-y-1.5">
                      <div className="font-semibold text-ink-primary text-[11px]">
                        &ldquo;{scene.onScreenText}&rdquo;
                      </div>
                      <EvidenceBadge id={scene.evidenceTag} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Six-Frame Storyboard */}
      {activeTab === "storyboard" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-serif text-xl font-bold text-ink-primary">
                Six-Frame Visual Storyboard
              </h2>
              <p className="text-xs text-ink-muted">
                Complete 6-scene shot list with visual directions, audio prompts, and evidence provenance
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                handleCopy(
                  currentData.sixFrameStoryboard
                    .map(
                      (f) =>
                        `Frame ${f.frameNumber}: ${f.sceneTitle}\nVisual: ${f.visualAction}\nAudio: ${f.spokenAudio}\nText: ${f.onScreenText}\nCitation: [${f.evidenceTag}]\n`
                    )
                    .join("\n"),
                  "sb-copy"
                )
              }
              className={`px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 self-start sm:self-auto transition-all ${
                copiedKey === "sb-copy"
                  ? "bg-status-success text-ink-inverted"
                  : "bg-app-subtle text-ink-primary hover:bg-terracotta hover:text-ink-inverted border border-line-subtle"
              }`}
            >
              {copiedKey === "sb-copy" ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Storyboard</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentData.sixFrameStoryboard.map((frame) => (
              <div
                key={frame.frameNumber}
                className="p-5 rounded-2xl bg-app-card border border-line-subtle hover:border-line-strong transition-all shadow-clay-sm flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-line-subtle">
                    <span className="font-mono text-xs font-bold text-terracotta">
                      Frame 0{frame.frameNumber}
                    </span>
                    <EvidenceBadge id={frame.evidenceTag} />
                  </div>

                  <h3 className="font-serif text-base font-bold text-ink-primary">
                    {frame.sceneTitle}
                  </h3>

                  {/* Visual Action */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase text-ink-muted block">
                      Visual Direction
                    </span>
                    <p className="text-xs text-ink-primary leading-relaxed bg-app-subtle p-3 rounded-lg border border-line-subtle">
                      {frame.visualAction}
                    </p>
                  </div>

                  {/* Spoken Audio */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase text-ink-muted block">
                      Audio Voiceover
                    </span>
                    <p className="text-xs italic text-ink-muted leading-relaxed">
                      {frame.spokenAudio}
                    </p>
                  </div>

                  {/* On Screen Text */}
                  <div className="p-2.5 rounded-lg bg-sand-light/60 border border-line-subtle text-[11px] text-ink-primary">
                    <span className="font-bold block text-[10px] font-mono uppercase text-ink-muted">
                      On-Screen Graphic
                    </span>
                    &ldquo;{frame.onScreenText}&rdquo;
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Promo Video Concept */}
      {activeTab === "video" && (
        <div className="p-6 sm:p-8 rounded-2xl bg-app-card border border-line-subtle shadow-clay-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-line-subtle">
            <div>
              <h2 className="font-serif text-xl font-bold text-ink-primary">
                High-Level Promo Video Creative Brief
              </h2>
              <p className="text-xs text-ink-muted">
                D2C video creative direction, core visual metaphor, emotional narrative arc, and audio mood
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                handleCopy(
                  `Concept: ${currentData.promoVideoConcept.conceptTitle}\nMetaphor: ${currentData.promoVideoConcept.coreMetaphor}\nHook: ${currentData.promoVideoConcept.creativeHook}\nPersona: ${currentData.promoVideoConcept.targetPersona}\nBenefit: ${currentData.promoVideoConcept.keyBenefit}\nAudio: ${currentData.promoVideoConcept.audioDirection}\nCTA: ${currentData.promoVideoConcept.callToAction}\nProvenance: ${currentData.promoVideoConcept.evidenceProvenance}`,
                  "video-copy"
                )
              }
              className={`px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-all ${
                copiedKey === "video-copy"
                  ? "bg-status-success text-ink-inverted"
                  : "bg-app-subtle text-ink-primary hover:bg-terracotta hover:text-ink-inverted border border-line-subtle"
              }`}
            >
              {copiedKey === "video-copy" ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Creative Brief</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-5 max-w-4xl text-xs">
            {/* Title & Metaphor */}
            <div className="p-5 rounded-2xl bg-app-subtle border border-line-subtle space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-terracotta">
                Creative Direction
              </span>
              <h3 className="font-serif text-2xl font-bold text-ink-primary">
                {currentData.promoVideoConcept.conceptTitle}
              </h3>
              <p className="text-ink-primary leading-relaxed text-sm">
                <strong>Core Visual Metaphor:</strong> {currentData.promoVideoConcept.coreMetaphor}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-app-subtle border border-line-subtle space-y-1.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted block">
                  Creative Hook (0-3s)
                </span>
                <p className="text-xs text-ink-primary leading-relaxed">
                  {currentData.promoVideoConcept.creativeHook}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-app-subtle border border-line-subtle space-y-1.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted block">
                  Target Audience Persona
                </span>
                <p className="text-xs text-ink-primary leading-relaxed">
                  {currentData.promoVideoConcept.targetPersona}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-app-subtle border border-line-subtle space-y-1.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted block">
                  Audio & Foley Direction
                </span>
                <p className="text-xs text-ink-primary leading-relaxed">
                  {currentData.promoVideoConcept.audioDirection}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-app-subtle border border-line-subtle space-y-1.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted block">
                  Call to Action (CTA)
                </span>
                <p className="text-xs font-semibold text-terracotta leading-relaxed">
                  {currentData.promoVideoConcept.callToAction}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-status-success-bg border border-sage/30 flex items-start gap-2.5 text-xs text-status-success">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Provenance & Grounding:</span>{" "}
                <span>{currentData.promoVideoConcept.evidenceProvenance}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
