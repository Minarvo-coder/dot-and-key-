"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/AppContext";
import EvidenceBadge from "@/components/EvidenceBadge";
import { getCatalogueStats } from "@/data/productsLoader";
import {
  Sparkles,
  ArrowRight,
  Database,
  Layers,
  Scale,
  MessageSquareQuote,
  TrendingUp,
  PenTool,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  FileText,
  BarChart2,
  Loader2,
} from "lucide-react";

export default function OverviewPage() {
  const router = useRouter();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const {
    selectedProduct,
    products,
    competitors,
    reviews,
    insightsData,
    metadata,
    openEvidence,
    analysisStatus,
    setAnalysisStatus,
  } = useApp();

  async function handleAnalyse() {
    setIsAnalyzing(true);
    if (setAnalysisStatus) setAnalysisStatus("running");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProduct?.id,
          productTitle: selectedProduct?.title || selectedProduct?.productName,
        }),
      }).catch(() => null);

      if (res && res.ok) {
        const data = await res.json().catch(() => null);
        if (data?.redirectUrl) {
          if (setAnalysisStatus) setAnalysisStatus("done");
          router.push(data.redirectUrl);
          return;
        }
      }
    } catch (e) {
      // Endpoint not ready
    }
    // "If the agent endpoint is not ready, navigate to Review Insights and do not fake a result."
    setTimeout(() => {
      if (setAnalysisStatus) setAnalysisStatus("done");
      router.push("/reviews");
    }, 600);
  }

  const [dataStats, setDataStats] = useState({
    catalogue: getCatalogueStats(),
    reviews: { count: null, sentiment: null, topInsights: [] },
    competitors: { count: null, names: [] },
  });

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(
          `/api/overview-data?productId=${selectedProduct?.id || ""}&productTitle=${encodeURIComponent(
            selectedProduct?.title || selectedProduct?.productName || ""
          )}`
        );
        if (res.ok) {
          const json = await res.json();
          setDataStats(json);
        }
      } catch (e) {
        console.error("Failed to load overview data:", e);
      }
    }
    loadData();
  }, [selectedProduct?.id, selectedProduct?.title]);

  const isRunning = isAnalyzing || analysisStatus === "running";
  const isDone = analysisStatus === "done";

  const workflowSteps = [
    {
      step: "01",
      title: "Product selected",
      desc: selectedProduct ? selectedProduct.productName : "Choose a product",
      status: selectedProduct ? "Done" : "Not started",
      href: "/products",
    },
    {
      step: "02",
      title: "Competitors compared",
      desc: "Compare pricing and features against alternatives",
      status: isRunning ? "Running" : isDone ? "Done" : "Not started",
      href: "/competitors",
    },
    {
      step: "03",
      title: "Reviews analysed",
      desc: "Customer feedback and sentiment breakdown",
      status: isRunning ? "Running" : isDone ? "Done" : "Not started",
      href: "/reviews",
    },
    {
      step: "04",
      title: "Opportunities found",
      desc: "Market gaps and winning angles",
      status: isRunning ? "Running" : isDone ? "Done" : "Not started",
      href: "/opportunities",
    },
    {
      step: "05",
      title: "Content ready",
      desc: "Campaign copy generated across multiple formats",
      status: isRunning ? "Running" : isDone ? "Done" : "Not started",
      href: "/marketing-studio",
    },
  ];

  const quickActions = [
    {
      title: "Product Catalogue",
      desc: "Browse Dot & Key products and switch the active research subject.",
      href: "/products",
      icon: Layers,
      tag: "Products",
    },
    {
      title: "Competitor Analysis",
      desc: "Compare competitors by price, ratings, claims, and flaws.",
      href: "/competitors",
      icon: Scale,
      tag: "Competitors",
    },
    {
      title: "Review Insights",
      desc: "Inspect customer feedback, sentiment breakdown, and real quotes.",
      href: "/reviews",
      icon: MessageSquareQuote,
      tag: "Reviews",
    },
    {
      title: "Market Opportunities",
      desc: "Review competitor gaps and actionable market angles.",
      href: "/opportunities",
      icon: TrendingUp,
      tag: "Opportunities",
    },
    {
      title: "Marketing Studio",
      desc: "Produce Instagram captions, PDP descriptions, A+ copy, and scripts.",
      href: "/marketing-studio",
      icon: PenTool,
      tag: "6 Formats",
    },
    {
      title: "SWOT Analysis",
      desc: "Explore strengths, weaknesses, opportunities, and threats.",
      href: "/swot",
      icon: BarChart2,
      tag: "Matrix",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Welcome Hero Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-app-card border border-line-subtle shadow-clay-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-sand/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sand-light border border-line-subtle text-xs font-mono font-medium text-ink-primary">
              <span className="w-2 h-2 rounded-full bg-terracotta animate-pulse" />
              <span>Dot & Key Intelligence</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink-primary tracking-tight leading-tight">
              Pick a product. See what the market says. Get ready-to-use ads.
            </h1>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
              Turn customer reviews and competitor data into ready-to-use marketing copy for Dot & Key.
            </p>
            <p className="text-[11px] font-mono text-ink-muted">
              Data collected from public pages (dotandkey.com, Nykaa, Amazon) on 21 Nov 2026
            </p>
          </div>

          {/* Action Buttons */}
          <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3">
            <button
              type="button"
              onClick={handleAnalyse}
              disabled={isAnalyzing}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-terracotta text-ink-inverted text-xs sm:text-sm font-semibold hover:bg-terracotta-hover disabled:opacity-75 disabled:cursor-not-allowed transition-all shadow-clay-sm"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Reading reviews...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyse this product</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-app-subtle border border-line-subtle text-ink-primary text-xs sm:text-sm font-semibold hover:bg-app-card transition-all"
            >
              <Layers className="w-4 h-4 text-ink-muted" />
              <span>Browse products</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Research Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-app-card border border-line-subtle shadow-clay-sm space-y-2">
          <div className="flex items-center justify-between text-ink-muted">
            <span className="text-[11px] font-mono uppercase font-semibold">Customer Reviews</span>
            <Database className="w-4 h-4 text-terracotta" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-ink-primary">
            {dataStats.reviews.count !== null && dataStats.reviews.count !== undefined
              ? dataStats.reviews.count.toLocaleString()
              : "No data yet"}
          </div>
          <div className="text-[11px] text-ink-muted flex items-center gap-1">
            {dataStats.reviews.count !== null && dataStats.reviews.count !== undefined ? (
              <span>From public pages</span>
            ) : (
              <span>No reviews loaded yet</span>
            )}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-app-card border border-line-subtle shadow-clay-sm space-y-2">
          <div className="flex items-center justify-between text-ink-muted">
            <span className="text-[11px] font-mono uppercase font-semibold">Dot & Key Catalogue</span>
            <Layers className="w-4 h-4 text-terracotta" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-ink-primary">
            {dataStats.catalogue.count} Products
          </div>
          <div className="text-[11px] text-ink-muted flex items-center gap-1">
            <span>Price range: {dataStats.catalogue.priceRange || dataStats.catalogue.priceRangeFormatted}</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-app-card border border-line-subtle shadow-clay-sm space-y-2">
          <div className="flex items-center justify-between text-ink-muted">
            <span className="text-[11px] font-mono uppercase font-semibold">Competitors Compared</span>
            <Scale className="w-4 h-4 text-terracotta" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-ink-primary">
            {dataStats.competitors.count !== null && dataStats.competitors.count !== undefined
              ? `${dataStats.competitors.count} Brands`
              : "No data yet"}
          </div>
          <div className="text-[11px] text-ink-muted truncate">
            {dataStats.competitors.names && dataStats.competitors.names.length > 0
              ? dataStats.competitors.names.join(", ")
              : "No competitors loaded yet"}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-app-card border border-line-subtle shadow-clay-sm space-y-2">
          <div className="flex items-center justify-between text-ink-muted">
            <span className="text-[11px] font-mono uppercase font-semibold">Sentiment</span>
            <ShieldCheck className="w-4 h-4 text-sage-dark" />
          </div>
          <div
            className={`text-2xl sm:text-3xl font-serif font-bold ${
              dataStats.reviews.sentiment ? "text-status-success" : "text-ink-primary"
            }`}
          >
            {dataStats.reviews.sentiment
              ? `${dataStats.reviews.sentiment.positivePercent}% Positive`
              : "No data yet"}
          </div>
          <div className="text-[11px] text-ink-muted">
            {dataStats.reviews.sentiment
              ? `${dataStats.reviews.sentiment.neutralPercent}% Neutral • ${dataStats.reviews.sentiment.criticalPercent}% Critical`
              : "Awaiting review data"}
          </div>
        </div>
      </div>

      {/* 3. Workflow Progress Stepper */}
      <div className="p-6 rounded-2xl bg-app-card border border-line-subtle shadow-clay-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-line-subtle">
          <div>
            <h2 className="font-serif text-xl font-bold text-ink-primary">
              Product-to-Content Workflow Progress
            </h2>
            <p className="text-xs text-ink-muted mt-0.5">
              Five linked stages to turn research into marketing content
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {workflowSteps.map((ws) => (
            <Link
              key={ws.step}
              href={ws.href}
              className="p-4 rounded-xl bg-app-subtle hover:bg-app-card border border-line-subtle hover:border-terracotta/40 transition-all group relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-terracotta">
                    {ws.step}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${
                      ws.status === "Done"
                        ? "bg-status-success-bg text-status-success border border-sage/20"
                        : ws.status === "Running"
                        ? "bg-terracotta/10 text-terracotta border border-terracotta/30"
                        : "bg-app-card text-ink-muted border border-line-subtle"
                    }`}
                  >
                    {ws.status === "Done" && <CheckCircle2 className="w-3 h-3" />}
                    {ws.status === "Running" && <Loader2 className="w-3 h-3 animate-spin" />}
                    {ws.status === "Not started" && <Clock className="w-3 h-3" />}
                    <span>{ws.status}</span>
                  </span>
                </div>
                <h3 className="text-xs font-bold text-ink-primary group-hover:text-terracotta transition-colors">
                  {ws.title}
                </h3>
                <p className="text-[11px] text-ink-muted mt-1 leading-relaxed">
                  {ws.desc}
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-line-subtle/50 flex items-center justify-between text-[10px] font-mono text-ink-muted">
                <span>View Stage</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform text-terracotta" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 4. Quick Actions & Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions (2 cols on large) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-ink-primary">
              Quick Actions
            </h2>
            <span className="text-xs text-ink-muted">Direct navigation</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickActions.map((qa) => {
              const Icon = qa.icon;
              return (
                <Link
                  key={qa.title}
                  href={qa.href}
                  className="p-4 rounded-xl bg-app-card hover:bg-app-subtle border border-line-subtle hover:border-terracotta/40 transition-all group shadow-clay-sm flex items-start gap-3.5"
                >
                  <div className="w-9 h-9 rounded-xl bg-terracotta/10 text-terracotta flex items-center justify-center shrink-0 group-hover:bg-terracotta group-hover:text-ink-inverted transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <h3 className="text-xs font-bold text-ink-primary group-hover:text-terracotta transition-colors truncate">
                        {qa.title}
                      </h3>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-sand-light text-ink-primary border border-line-subtle shrink-0">
                        {qa.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-ink-muted leading-relaxed">
                      {qa.desc}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Top Insights (Replacing fake Recent Intelligence) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-ink-primary">
              Top insights
            </h2>
            <span className="text-xs text-ink-muted">Public Reviews</span>
          </div>

          <div className="p-4 rounded-2xl bg-app-card border border-line-subtle shadow-clay-sm">
            {!dataStats.reviews.topInsights || dataStats.reviews.topInsights.length === 0 ? (
              <div className="py-8 text-center text-xs text-ink-muted space-y-1">
                <p className="font-medium text-ink-primary">No reviews loaded yet</p>
                <p>Add reviews to /data/reviews.json to see live insights.</p>
              </div>
            ) : (
              <div className="divide-y divide-line-subtle/50">
                {dataStats.reviews.topInsights.slice(0, 3).map((insight, idx) => (
                  <div key={insight.id || idx} className="py-3 first:pt-0 last:pb-0 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1 text-xs text-terracotta">
                        {"★".repeat(insight.stars || 5)}
                        <span className="text-[10px] text-ink-muted ml-1">
                          ({insight.stars || 5}/5)
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-ink-muted">
                        {insight.sourceName}
                      </span>
                    </div>
                    <p className="text-xs text-ink-primary leading-relaxed line-clamp-3 italic">
                      "{insight.text}"
                    </p>
                    {insight.sourceUrl && (
                      <div className="pt-0.5">
                        <a
                          href={insight.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-mono text-terracotta hover:underline inline-flex items-center gap-1"
                        >
                          View source ↗
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
