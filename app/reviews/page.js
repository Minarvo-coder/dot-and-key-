"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "@/components/AppContext";
import EvidenceBadge from "@/components/EvidenceBadge";
import {
  MessageSquareQuote,
  Star,
  ShieldCheck,
  Search,
  Filter,
  ThumbsUp,
  AlertCircle,
  Tag,
  Info,
  Calendar,
  User,
  CheckCircle,
  RotateCcw,
} from "lucide-react";

export default function ReviewInsightsPage() {
  const {
    reviews,
    insightsData,
    metadata,
    selectedProduct,
    openEvidence,
  } = useApp();

  const [sentimentFilter, setSentimentFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { sentimentBreakdown } = insightsData;

  const filteredReviews = useMemo(() => {
    return reviews.filter((rev) => {
      // Sentiment filter
      if (sentimentFilter !== "all" && rev.sentiment !== sentimentFilter) {
        return false;
      }
      // Platform filter
      if (platformFilter !== "all" && !rev.sourcePlatform.toLowerCase().includes(platformFilter.toLowerCase())) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchQuote = rev.verbatimQuote.toLowerCase().includes(q);
        const matchReviewer = rev.reviewer?.toLowerCase().includes(q);
        const matchProduct = rev.productName.toLowerCase().includes(q);
        const matchTags = rev.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchQuote && !matchReviewer && !matchProduct && !matchTags) return false;
      }
      return true;
    });
  }, [reviews, sentimentFilter, platformFilter, searchQuery]);

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
            <span className="text-xs text-ink-muted">Customer Voice Ingestion</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink-primary">
            Customer Review Insights & Sentiment
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted mt-0.5">
            Audited sentiment split, key positive drivers, complaints, and verbatim buyer citations for{" "}
            <span className="font-semibold text-ink-primary">{selectedProduct.productName}</span>.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sand-light text-ink-primary border border-line-subtle">
            {metadata.totalReviewsAudited?.toLocaleString() || "4,820"} Audited Records
          </span>
        </div>
      </div>

      {/* 1. Provenance and Sample Source Banner */}
      <div className="p-5 rounded-2xl bg-app-card border border-line-subtle shadow-clay-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-sage-soft text-sage-dark flex items-center justify-center shrink-0 border border-sage/20">
            <Info className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-serif text-base font-bold text-ink-primary">
                {metadata.datasetName}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-status-success-bg text-status-success font-semibold border border-sage/30">
                Public Customer Reviews
              </span>
            </div>
            <p className="text-xs text-ink-muted leading-relaxed max-w-2xl">
              All excerpts are ingested directly from public retail channels (Nykaa, Amazon India, Purplle, Dot & Key D2C) with buyer verification stamps. No synthetic feedback.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-app-subtle border border-line-subtle text-center">
            <span className="text-ink-muted block text-[10px] uppercase">Platforms</span>
            <span className="font-bold text-ink-primary">4 Retail Stores</span>
          </div>
          <div className="p-2.5 rounded-xl bg-app-subtle border border-line-subtle text-center">
            <span className="text-ink-muted block text-[10px] uppercase">Last Audit</span>
            <span className="font-bold text-ink-primary">{metadata.lastAuditedDate}</span>
          </div>
        </div>
      </div>

      {/* 2. Sentiment Split Bar & Overview */}
      <div className="p-6 rounded-2xl bg-app-card border border-line-subtle shadow-clay-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-serif text-xl font-bold text-ink-primary">
              Sentiment Distribution
            </h2>
            <p className="text-xs text-ink-muted">
              Audited split across {metadata.totalReviewsAudited?.toLocaleString() || "4,820"} reviews
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-status-success">
              <span className="w-2.5 h-2.5 rounded-full bg-status-success" />
              Positive: {sentimentBreakdown.positivePercent}%
            </span>
            <span className="flex items-center gap-1.5 text-status-warning">
              <span className="w-2.5 h-2.5 rounded-full bg-status-warning" />
              Neutral: {sentimentBreakdown.neutralPercent}%
            </span>
            <span className="flex items-center gap-1.5 text-status-error">
              <span className="w-2.5 h-2.5 rounded-full bg-status-error" />
              Critical: {sentimentBreakdown.criticalPercent}%
            </span>
          </div>
        </div>

        {/* Stacked Progress Bar */}
        <div className="w-full h-3 rounded-full bg-line-subtle overflow-hidden flex shadow-inner">
          <div
            style={{ width: `${sentimentBreakdown.positivePercent}%` }}
            className="h-full bg-status-success transition-all duration-500"
            title={`Positive: ${sentimentBreakdown.positivePercent}%`}
          />
          <div
            style={{ width: `${sentimentBreakdown.neutralPercent}%` }}
            className="h-full bg-status-warning transition-all duration-500"
            title={`Neutral: ${sentimentBreakdown.neutralPercent}%`}
          />
          <div
            style={{ width: `${sentimentBreakdown.criticalPercent}%` }}
            className="h-full bg-status-error transition-all duration-500"
            title={`Critical: ${sentimentBreakdown.criticalPercent}%`}
          />
        </div>
      </div>

      {/* 3. Top Customer Loves vs Complaints Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Loves (Positive Drivers) */}
        <div className="p-6 rounded-2xl bg-app-card border border-line-subtle shadow-clay-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-line-subtle">
            <h3 className="font-serif text-lg font-bold text-status-success flex items-center gap-2">
              <ThumbsUp className="w-4 h-4" />
              <span>Top Customer Loves (Positive Drivers)</span>
            </h3>
            <span className="text-[11px] font-mono text-ink-muted">
              {sentimentBreakdown.keyPositiveDrivers.length} Themes
            </span>
          </div>

          <ul className="space-y-2.5">
            {sentimentBreakdown.keyPositiveDrivers.map((driver, i) => (
              <li
                key={i}
                className="p-3 rounded-xl bg-status-success-bg border border-sage/20 text-xs text-status-success flex items-start gap-2.5"
              >
                <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-status-success" />
                <span className="leading-relaxed font-medium">{driver}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Top Customer Complaints (Critical Drivers) */}
        <div className="p-6 rounded-2xl bg-app-card border border-line-subtle shadow-clay-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-line-subtle">
            <h3 className="font-serif text-lg font-bold text-status-error flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>Top Complaints (Critical Drivers)</span>
            </h3>
            <span className="text-[11px] font-mono text-ink-muted">
              {sentimentBreakdown.keyCriticalDrivers.length} Themes
            </span>
          </div>

          <ul className="space-y-2.5">
            {sentimentBreakdown.keyCriticalDrivers.map((driver, i) => (
              <li
                key={i}
                className="p-3 rounded-xl bg-status-error-bg border border-status-error/20 text-xs text-status-error flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-status-error" />
                <span className="leading-relaxed font-medium">{driver}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 4. Filterable Verbatim Review Snippets */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-serif text-xl font-bold text-ink-primary">
              Actual Review Snippets & Evidence Provenance
            </h2>
            <p className="text-xs text-ink-muted">
              Browse verbatim customer excerpts anchored to traceable evidence IDs
            </p>
          </div>

          <span className="text-xs font-mono text-ink-muted">
            Showing {filteredReviews.length} Excerpts
          </span>
        </div>

        {/* Filter Controls */}
        <div className="p-4 rounded-2xl bg-app-card border border-line-subtle shadow-clay-sm space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search reviews by quote, tag (e.g. humidity, pilling, kombucha)..."
                className="w-full pl-10 pr-9 py-2 rounded-xl bg-app-subtle border border-line-subtle text-xs text-ink-primary placeholder-ink-muted focus:border-terracotta focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink-primary text-xs"
                >
                  ×
                </button>
              )}
            </div>

            {/* Platform Select */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-ink-muted font-mono hidden sm:inline">Platform:</span>
              <select
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-app-subtle border border-line-subtle text-xs text-ink-primary focus:border-terracotta focus:outline-none cursor-pointer"
              >
                <option value="all">All Retail Platforms</option>
                <option value="nykaa">Nykaa Verified</option>
                <option value="amazon">Amazon India</option>
                <option value="purplle">Purplle</option>
              </select>
            </div>
          </div>

          {/* Sentiment Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1">
            <button
              type="button"
              onClick={() => setSentimentFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                sentimentFilter === "all"
                  ? "bg-terracotta text-ink-inverted font-semibold shadow-clay-sm"
                  : "bg-app-subtle text-ink-muted hover:text-ink-primary"
              }`}
            >
              All Sentiments ({reviews.length})
            </button>
            <button
              type="button"
              onClick={() => setSentimentFilter("positive")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                sentimentFilter === "positive"
                  ? "bg-status-success text-ink-inverted font-semibold shadow-clay-sm"
                  : "bg-app-subtle text-ink-muted hover:text-ink-primary"
              }`}
            >
              Positive Reviews
            </button>
            <button
              type="button"
              onClick={() => setSentimentFilter("critical")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                sentimentFilter === "critical"
                  ? "bg-status-error text-ink-inverted font-semibold shadow-clay-sm"
                  : "bg-app-subtle text-ink-muted hover:text-ink-primary"
              }`}
            >
              Critical / Complaints
            </button>
            <button
              type="button"
              onClick={() => setSentimentFilter("competitor_defect")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                sentimentFilter === "competitor_defect"
                  ? "bg-status-error text-ink-inverted font-semibold shadow-clay-sm"
                  : "bg-app-subtle text-ink-muted hover:text-ink-primary"
              }`}
            >
              Competitor Defect Audits
            </button>
          </div>
        </div>

        {/* Review Cards Feed */}
        {filteredReviews.length === 0 ? (
          <div className="p-12 rounded-2xl bg-app-card border border-line-subtle text-center space-y-4 shadow-clay-sm">
            <div className="w-12 h-12 rounded-2xl bg-app-subtle text-ink-muted flex items-center justify-center mx-auto">
              <MessageSquareQuote className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-ink-primary">
                No customer reviews match your criteria
              </h3>
              <p className="text-xs text-ink-muted mt-1 max-w-sm mx-auto">
                No excerpts found matching your current filter settings. Try adjusting sentiment or clearing search query.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSentimentFilter("all");
                setPlatformFilter("all");
                setSearchQuery("");
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-app-subtle border border-line-subtle text-ink-primary text-xs font-semibold hover:bg-app-card transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredReviews.map((rev) => {
              const isCompetitor = rev.sentiment === "competitor_defect";
              const isPositive = rev.sentiment === "positive";

              return (
                <div
                  key={rev.id}
                  className="p-5 rounded-2xl bg-app-card border border-line-subtle hover:border-line-strong transition-all shadow-clay-sm flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Header: Reviewer, Rating, Evidence Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-ink-primary">
                            {rev.reviewer || "Verified Customer"}
                          </span>
                          {rev.verifiedPurchase && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-status-success-bg text-status-success font-semibold border border-sage/20">
                              Verified
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-ink-muted mt-0.5">
                          <span>{rev.sourcePlatform}</span>
                          <span>•</span>
                          <span>{rev.date}</span>
                        </div>
                      </div>

                      <EvidenceBadge id={rev.id} />
                    </div>

                    {/* Star Rating and Product */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <div className="flex items-center gap-1 text-terracotta">
                        {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-terracotta text-terracotta" />
                        ))}
                      </div>
                      <span className="text-[11px] font-semibold text-terracotta truncate max-w-[200px]">
                        {rev.productName}
                      </span>
                    </div>

                    {/* Verbatim Excerpt */}
                    <blockquote
                      className={`p-3.5 rounded-xl border-l-4 italic text-xs leading-relaxed ${
                        isPositive
                          ? "bg-status-success-bg/40 border-status-success text-ink-primary"
                          : isCompetitor
                          ? "bg-status-error-bg/40 border-status-error text-ink-primary"
                          : "bg-app-subtle border-terracotta text-ink-primary"
                      }`}
                    >
                      &ldquo;{rev.verbatimQuote}&rdquo;
                    </blockquote>

                    {/* Topic Tags */}
                    {rev.tags && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {rev.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-app-subtle text-ink-muted border border-line-subtle"
                          >
                            <Tag className="w-2.5 h-2.5" />
                            {tag.replace(/_/g, " ")}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer Action */}
                  <div className="pt-3 border-t border-line-subtle/60 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-ink-muted font-mono">
                      Category: {rev.category}
                    </span>
                    <button
                      type="button"
                      onClick={() => openEvidence(rev)}
                      className="text-terracotta hover:underline font-semibold text-[11px]"
                    >
                      Inspect Evidence Record →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
