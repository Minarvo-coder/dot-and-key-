"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useApp } from "@/components/AppContext";
import EvidenceBadge from "@/components/EvidenceBadge";
import {
  Search,
  Filter,
  CheckCircle,
  ExternalLink,
  Star,
  Layers,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  PackageCheck,
  RotateCcw,
} from "lucide-react";

export default function ProductLibraryPage() {
  const {
    products,
    selectedProduct,
    setSelectedProduct,
    openEvidence,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [analyzedFeedback, setAnalyzedFeedback] = useState(null);

  const categories = [
    { id: "all", label: "All Formulations" },
    { id: "moisturizer", label: "Moisturizers & Gels" },
    { id: "sunscreen", label: "Sunscreens" },
    { id: "treatment", label: "Night & Blemish" },
    { id: "serum", label: "Serums & Peptides" },
  ];

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory === "moisturizer" && !p.category.toLowerCase().includes("moisturizer")) return false;
        if (selectedCategory === "sunscreen" && !p.category.toLowerCase().includes("sunscreen")) return false;
        if (selectedCategory === "treatment" && !p.category.toLowerCase().includes("night") && !p.category.toLowerCase().includes("blemish")) return false;
        if (selectedCategory === "serum" && !p.category.toLowerCase().includes("serum")) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.productName.toLowerCase().includes(q);
          const matchCategory = p.category.toLowerCase().includes(q);
          const matchIng = p.activeIngredients.some((ing) => ing.toLowerCase().includes(q));
          const matchClaim = p.verifiedClaims?.some((c) => c.toLowerCase().includes(q));
          if (!matchName && !matchCategory && !matchIng && !matchClaim) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.retailPriceINR - b.retailPriceINR;
        if (sortBy === "price-high") return b.retailPriceINR - a.retailPriceINR;
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "reviews") return b.reviewCount - a.reviewCount;
        return 0;
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  function handleSelectProduct(prod) {
    setSelectedProduct(prod);
    setAnalyzedFeedback(prod.productName);
    setTimeout(() => {
      setAnalyzedFeedback(null);
    }, 3500);
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line-subtle">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase font-bold text-terracotta">
              WORKSPACE
            </span>
            <span className="text-ink-muted text-xs">•</span>
            <span className="text-xs text-ink-muted">Flagship Catalogue</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink-primary">
            Dot & Key Product Library
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted mt-0.5">
            Searchable catalogue of verified Dot & Key formulas. Select a product to anchor all competitor benchmarks and campaign generation.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-mono text-ink-muted">
            {filteredProducts.length} of {products.length} Products
          </span>
        </div>
      </div>

      {/* Analysis Confirmation Toast Banner */}
      {analyzedFeedback && (
        <div className="p-4 rounded-xl bg-status-success-bg border border-sage/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-status-success shadow-clay-sm animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2.5">
            <PackageCheck className="w-5 h-5 text-status-success shrink-0" />
            <div>
              <span className="font-bold">Active Subject Updated:</span>{" "}
              <span>{analyzedFeedback} is now set as the global focus across all research and studio pages.</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/competitors"
              className="px-3 py-1.5 rounded-lg bg-status-success text-ink-inverted font-semibold text-[11px] hover:opacity-90 transition-opacity"
            >
              View Competitors →
            </Link>
            <Link
              href="/marketing-studio"
              className="px-3 py-1.5 rounded-lg bg-app-card border border-sage/30 text-ink-primary font-semibold text-[11px] hover:bg-app-subtle transition-colors"
            >
              Open Studio →
            </Link>
          </div>
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-app-card border border-line-subtle shadow-clay-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, ingredient (e.g. Kombucha, Cica, Hyaluronic)..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-app-subtle border border-line-subtle text-xs text-ink-primary placeholder-ink-muted focus:border-terracotta focus:outline-none transition-all"
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

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-ink-muted font-mono hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-app-subtle border border-line-subtle text-xs text-ink-primary focus:border-terracotta focus:outline-none cursor-pointer"
            >
              <option value="default">Default Order</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="reviews">Most Reviews</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1">
          {categories.map((c) => {
            const isSelected = selectedCategory === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-terracotta text-ink-inverted font-semibold shadow-clay-sm"
                    : "bg-app-subtle text-ink-muted hover:text-ink-primary hover:bg-line-subtle/50"
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Cards Grid */}
      {filteredProducts.length === 0 ? (
        /* Empty State */
        <div className="p-12 rounded-2xl bg-app-card border border-line-subtle text-center space-y-4 shadow-clay-sm">
          <div className="w-12 h-12 rounded-2xl bg-app-subtle text-ink-muted flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-ink-primary">
              No matching products found
            </h3>
            <p className="text-xs text-ink-muted mt-1 max-w-sm mx-auto">
              No Dot & Key products match your search query &ldquo;{searchQuery}&rdquo;. Try searching by active ingredient (e.g. Kombucha, Cica) or reset filters.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-app-subtle border border-line-subtle text-ink-primary text-xs font-semibold hover:bg-app-card transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((prod) => {
            const isSelected = selectedProduct?.id === prod.id;

            return (
              <div
                key={prod.id}
                className={`rounded-2xl border transition-all flex flex-col justify-between bg-app-card shadow-clay-sm relative overflow-hidden ${
                  isSelected
                    ? "border-terracotta ring-2 ring-terracotta/20 shadow-clay-md"
                    : "border-line-subtle hover:border-line-strong hover:shadow-clay-md"
                }`}
              >
                {/* Active Indicator Top Bar */}
                {isSelected && (
                  <div className="bg-terracotta px-4 py-1 text-[11px] font-semibold text-ink-inverted flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Active Subject Under Analysis
                    </span>
                    <span className="font-mono text-[10px]">SELECTED</span>
                  </div>
                )}

                <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    {/* Brand + Evidence Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-app-subtle text-terracotta border border-line-subtle">
                        {prod.brand}
                      </span>
                      <EvidenceBadge id={prod.evidenceId} />
                    </div>

                    {/* Product Title */}
                    <div>
                      <h3 className="font-serif text-lg font-bold text-ink-primary leading-snug">
                        {prod.productName}
                      </h3>
                      <span className="text-xs text-ink-muted block mt-0.5">
                        {prod.category}
                      </span>
                    </div>

                    {/* Pricing & Volume Matrix */}
                    <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-app-subtle border border-line-subtle/80 text-xs">
                      <div>
                        <span className="text-[10px] uppercase text-ink-muted block">Price</span>
                        <span className="font-bold text-ink-primary text-sm">
                          ₹{prod.retailPriceINR}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-ink-muted block">Volume</span>
                        <span className="font-medium text-ink-primary">
                          {prod.volumeML}ml
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-ink-muted block">Per ML</span>
                        <span className="font-bold text-terracotta">
                          ₹{prod.pricePerML}
                        </span>
                      </div>
                    </div>

                    {/* Rating & Audited Reviews */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <div className="flex items-center gap-1 text-terracotta">
                        <Star className="w-3.5 h-3.5 fill-terracotta text-terracotta" />
                        <span className="font-bold text-ink-primary">{prod.rating}</span>
                        <span className="text-ink-muted">/ 5.0</span>
                      </div>
                      <span className="text-ink-muted text-[11px] font-mono">
                        {prod.reviewCount?.toLocaleString()} Audited Reviews
                      </span>
                    </div>

                    {/* Active Ingredients */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-mono uppercase font-bold text-ink-muted block">
                        Hero Actives
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {prod.activeIngredients.map((ing, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-app-subtle text-ink-primary border border-line-subtle"
                          >
                            {ing}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Texture and Finish */}
                    <div className="text-[11px] text-ink-muted bg-sand-light/50 p-2.5 rounded-lg border border-line-subtle">
                      <strong>Texture:</strong> {prod.texture} ({prod.finish})
                    </div>

                    {/* Verified Claims */}
                    {prod.verifiedClaims && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono uppercase font-bold text-ink-muted block">
                          Verified Claims
                        </span>
                        <ul className="space-y-0.5 text-[11px] text-ink-muted">
                          {prod.verifiedClaims.slice(0, 2).map((claim, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <ShieldCheck className="w-3.5 h-3.5 text-sage-dark shrink-0 mt-0.5" />
                              <span className="leading-tight">{claim}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-4 mt-4 border-t border-line-subtle flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleSelectProduct(prod)}
                      className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                        isSelected
                          ? "bg-app-subtle text-terracotta border border-terracotta/40 hover:bg-terracotta/10"
                          : "bg-terracotta text-ink-inverted hover:bg-terracotta-hover shadow-clay-sm"
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Active Subject</span>
                        </>
                      ) : (
                        <>
                          <span>Analyse Product</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => openEvidence(prod)}
                      className="p-2.5 rounded-xl bg-app-subtle text-ink-muted hover:text-ink-primary hover:bg-app-card border border-line-subtle transition-colors"
                      title="Inspect full product specification"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
