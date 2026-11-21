"use client";

import React, { useState } from "react";
import {
  ExternalLink,
  ShieldCheck,
  Star,
  Layers,
  AlertTriangle,
  Info,
  CheckCircle,
  Filter,
  Sparkles,
} from "lucide-react";

export default function ResearchSection({
  products,
  competitors,
  reviews,
  selectedProduct,
  setSelectedProduct,
  onInspectEvidence,
  metadata,
  searchQuery,
}) {
  const [sentimentFilter, setSentimentFilter] = useState("all");

  // Filter reviews by active product target or competitor, plus sentiment and search query
  const filteredReviews = reviews.filter((rev) => {
    // If filtering by sentiment
    if (sentimentFilter !== "all" && rev.sentiment !== sentimentFilter) {
      return false;
    }
    // Search query filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchQuote = rev.verbatimQuote.toLowerCase().includes(q);
      const matchProduct = rev.productName.toLowerCase().includes(q);
      const matchTags = rev.tags?.some((t) => t.toLowerCase().includes(q));
      if (!matchQuote && !matchProduct && !matchTags) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* 1. Research-Data Status Banner */}
      <div className="p-5 sm:p-6 bg-app-card rounded-2xl border border-line-subtle shadow-clay-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-sage-soft text-sage-dark flex items-center justify-center shrink-0 border border-sage/20">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-serif text-lg font-bold text-ink-primary">
                  {metadata?.datasetName || "Dot & Key Skincare Market Audit"}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sand-light text-ink-primary border border-line-subtle">
                  {metadata?.status || "Demonstration Fixture"}
                </span>
              </div>
              <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                {metadata?.provenanceStatement}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0 text-xs">
            <div className="px-3 py-2 bg-app-subtle rounded-lg border border-line-subtle">
              <span className="text-ink-muted block text-[10px] uppercase font-semibold">
                Audit Scope
              </span>
              <span className="font-semibold text-ink-primary">
                {metadata?.totalReviewsAudited?.toLocaleString()} Verified Reviews
              </span>
            </div>
            <div className="px-3 py-2 bg-app-subtle rounded-lg border border-line-subtle">
              <span className="text-ink-muted block text-[10px] uppercase font-semibold">
                Last Ingestion
              </span>
              <span className="font-semibold text-ink-primary">{metadata?.lastAuditedDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Primary Product Selector (Dot & Key) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl text-ink-primary font-bold">
              1. Primary Product Under Research
            </h2>
            <p className="text-xs text-ink-muted">
              Select a flagship Dot & Key product to anchor competitor benchmarking and marketing generation
            </p>
          </div>
          <span className="text-xs font-medium text-ink-muted">
            {products.length} Products Configured
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((prod) => {
            const isSelected = selectedProduct.id === prod.id;
            return (
              <div
                key={prod.id}
                onClick={() => setSelectedProduct(prod)}
                className={`p-6 rounded-2xl border transition-all cursor-pointer relative bg-app-card ${
                  isSelected
                    ? "border-terracotta ring-2 ring-terracotta/20 shadow-clay-md"
                    : "border-line-subtle hover:border-line-strong shadow-clay-sm"
                }`}
              >
                {isSelected && (
                  <span className="absolute top-4 right-4 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-terracotta text-ink-inverted">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Active Subject
                  </span>
                )}

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-app-subtle text-terracotta border border-line-subtle">
                      {prod.brand}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onInspectEvidence(prod);
                      }}
                      className="font-mono text-[11px] text-ink-muted hover:text-terracotta underline"
                      title="Inspect full product spec"
                    >
                      [{prod.evidenceId}]
                    </button>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-ink-primary leading-snug">
                    {prod.productName}
                  </h3>

                  <div className="flex items-baseline gap-4 pt-1 border-t border-line-subtle/60 text-xs">
                    <div>
                      <span className="text-ink-muted block text-[10px] uppercase">Retail Price</span>
                      <span className="text-base font-semibold text-ink-primary">
                        ₹{prod.retailPriceINR}
                      </span>
                      <span className="text-ink-muted ml-1">({prod.volumeML}ml)</span>
                    </div>
                    <div>
                      <span className="text-ink-muted block text-[10px] uppercase">
                        Standardized Unit
                      </span>
                      <span className="text-base font-semibold text-terracotta">
                        ₹{prod.pricePerML}
                      </span>
                      <span className="text-ink-muted ml-1">/ ml</span>
                    </div>
                    <div>
                      <span className="text-ink-muted block text-[10px] uppercase">Rating</span>
                      <span className="text-base font-semibold text-ink-primary flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-terracotta text-terracotta" />
                        {prod.rating}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <span className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider block">
                      Active Formulation Matrix
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {prod.activeIngredients.map((ing, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-app-subtle text-ink-primary text-xs border border-line-subtle"
                        >
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-line-subtle/60 flex items-center justify-between text-xs">
                    <span className="text-ink-muted italic">Texture: {prod.texture}</span>
                    <a
                      href={prod.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-terracotta hover:underline font-medium"
                    >
                      <span>Store Listing</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Competitor Records */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl text-ink-primary font-bold">
              2. Tracked Competitor Records
            </h2>
            <p className="text-xs text-ink-muted">
              Direct market rivals benchmarked on active ingredients, price per ml, and consumer pain points
            </p>
          </div>
          <span className="text-xs text-ink-muted">3 Active Competitors</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {competitors.map((comp) => (
            <div
              key={comp.id}
              className="p-5 rounded-2xl bg-app-card border border-line-subtle shadow-clay-sm flex flex-col justify-between space-y-4 hover:border-line-strong transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-ink-primary text-ink-inverted">
                    {comp.brand}
                  </span>
                  <button
                    type="button"
                    onClick={() => onInspectEvidence(comp)}
                    className="font-mono text-[11px] text-ink-muted hover:text-terracotta underline"
                  >
                    [{comp.evidenceId}]
                  </button>
                </div>

                <h3 className="font-serif text-base font-bold text-ink-primary leading-snug">
                  {comp.productName}
                </h3>

                <div className="flex items-baseline justify-between text-xs pt-1 border-t border-line-subtle">
                  <div>
                    <span className="text-ink-muted block text-[10px]">Price</span>
                    <span className="font-semibold text-ink-primary">₹{comp.retailPriceINR}</span>
                  </div>
                  <div>
                    <span className="text-ink-muted block text-[10px]">Price/ml</span>
                    <span className="font-semibold text-ink-primary">₹{comp.pricePerML}/ml</span>
                  </div>
                  <div>
                    <span className="text-ink-muted block text-[10px]">Rating</span>
                    <span className="font-semibold text-ink-primary flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-terracotta text-terracotta" />
                      {comp.rating}
                    </span>
                  </div>
                </div>

                {/* Identified Consumer Flaw */}
                <div className="p-3 rounded-xl bg-status-error-bg border border-status-error/20 text-xs text-status-error space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-[11px] uppercase tracking-wider">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    Audited Vulnerability
                  </div>
                  <p className="text-[11px] leading-relaxed">{comp.identifiedFlaw}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-line-subtle flex items-center justify-between text-xs">
                <span className="text-[11px] text-ink-muted">{comp.sourcePlatform}</span>
                <a
                  href={comp.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-terracotta hover:underline font-medium text-xs"
                >
                  <span>Listing</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Customer Review Evidence Explorer */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-serif text-2xl text-ink-primary font-bold">
              3. Verified Customer Feedback Feed
            </h2>
            <p className="text-xs text-ink-muted">
              Audited customer reviews with stable evidence IDs. Click any ID badge to inspect verbatim source records.
            </p>
          </div>

          {/* Sentiment Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-app-subtle p-1 rounded-xl border border-line-subtle">
            {[
              { id: "all", label: "All Reviews" },
              { id: "positive", label: "Positive" },
              { id: "critical", label: "Critical" },
              { id: "competitor_defect", label: "Competitor Defects" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSentimentFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  sentimentFilter === tab.id
                    ? "bg-app-card text-ink-primary shadow-clay-sm font-semibold"
                    : "text-ink-muted hover:text-ink-primary"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        {filteredReviews.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border-2 border-dashed border-line-subtle bg-app-card/60">
            <Filter className="w-10 h-10 text-ink-muted mx-auto mb-3" />
            <h4 className="font-serif text-lg text-ink-primary font-semibold mb-1">
              No matching evidence records found
            </h4>
            <p className="text-xs text-ink-muted mb-4">
              Try adjusting your search query or switching the sentiment filter.
            </p>
            <button
              onClick={() => setSentimentFilter("all")}
              className="px-4 py-2 rounded-lg bg-app-subtle border border-line-subtle text-xs font-medium text-ink-primary hover:bg-app-card"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredReviews.map((rev) => {
              const isPositive = rev.sentiment === "positive";
              const isDefect = rev.sentiment === "competitor_defect";

              return (
                <div
                  key={rev.id}
                  className="p-5 rounded-2xl bg-app-card border border-line-subtle shadow-clay-sm flex flex-col justify-between space-y-4 hover:border-line-strong transition-all"
                >
                  <div className="space-y-3">
                    {/* Header with Evidence ID */}
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => onInspectEvidence(rev)}
                        className="font-mono text-xs font-semibold px-2.5 py-1 rounded bg-sand-light text-ink-primary border border-line-subtle hover:bg-terracotta hover:text-ink-inverted transition-colors cursor-pointer"
                        title="Click to inspect this evidence record"
                      >
                        [{rev.id}]
                      </button>

                      <div className="flex items-center gap-1">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-terracotta text-terracotta" />
                        ))}
                      </div>
                    </div>

                    {/* Brand and Target Product */}
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta">
                        {rev.brand}
                      </span>
                      <div className="text-xs font-semibold text-ink-primary truncate">
                        {rev.productName}
                      </div>
                    </div>

                    {/* Verbatim Quote */}
                    <blockquote className="text-xs text-ink-primary italic leading-relaxed border-l-2 border-line-strong pl-3">
                      &ldquo;{rev.verbatimQuote}&rdquo;
                    </blockquote>

                    {/* Tags */}
                    {rev.tags && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {rev.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-2 py-0.5 rounded bg-app-subtle text-ink-muted border border-line-subtle/50"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer with Source & Verification */}
                  <div className="pt-3 border-t border-line-subtle/60 flex items-center justify-between text-[11px] text-ink-muted">
                    <span className="truncate max-w-[140px]">{rev.reviewer}</span>
                    <span className="flex items-center gap-1 text-sage-dark font-medium">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {rev.sourcePlatform.split(" ")[0]}
                    </span>
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
