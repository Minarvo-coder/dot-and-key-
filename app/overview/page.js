"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/components/AppContext";
import EvidenceBadge from "@/components/EvidenceBadge";
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
} from "lucide-react";

export default function OverviewPage() {
  const {
    selectedProduct,
    products,
    competitors,
    reviews,
    insightsData,
    metadata,
    openEvidence,
  } = useApp();

  const workflowSteps = [
    {
      step: "01",
      title: "Product Selected",
      desc: selectedProduct ? selectedProduct.productName : "Choose subject",
      status: "completed",
      href: "/products",
      evidenceId: selectedProduct?.evidenceId,
    },
    {
      step: "02",
      title: "Competitors Normalized",
      desc: "5 market alternatives audited across price/ml",
      status: "completed",
      href: "/competitors",
      evidenceId: "EVD-PROD-CP01",
    },
    {
      step: "03",
      title: "Review Insights Ingested",
      desc: `${metadata?.totalReviewsAudited?.toLocaleString() || "4,820"} reviews with 74% positive split`,
      status: "completed",
      href: "/reviews",
      evidenceId: "EVD-REV-DK001",
    },
    {
      step: "04",
      title: "Opportunities Validated",
      desc: "3 high-conviction market angles formulated",
      status: "completed",
      href: "/opportunities",
      evidenceId: "EVD-REV-CP001",
    },
    {
      step: "05",
      title: "Marketing Studio Ready",
      desc: "6 campaign formats generated across 4 languages",
      status: "ready",
      href: "/marketing-studio",
      evidenceId: "",
    },
  ];

  const quickActions = [
    {
      title: "Product Catalogue",
      desc: "Browse 6 Dot & Key products and switch active research subject.",
      href: "/products",
      icon: Layers,
      tag: "6 Products",
    },
    {
      title: "Competitor Analysis",
      desc: "Benchmark 5 competitors by price/ml, ratings, claims, and flaws.",
      href: "/competitors",
      icon: Scale,
      tag: "5 Competitors",
    },
    {
      title: "Review Insights",
      desc: "Inspect customer loves, sentiment breakdown, and verbatim quotes.",
      href: "/reviews",
      icon: MessageSquareQuote,
      tag: "4,820 Reviews",
    },
    {
      title: "Market Opportunities",
      desc: "Review validated competitor gaps and high-conviction angles.",
      href: "/opportunities",
      icon: TrendingUp,
      tag: "3 Angles",
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
      desc: "Explore grounded strengths, weaknesses, opportunities, and threats.",
      href: "/swot",
      icon: BarChart2,
      tag: "Audited Matrix",
    },
  ];

  const recentActivity = [
    {
      id: "act-1",
      time: "12 mins ago",
      title: "Active Subject Synchronized",
      desc: `Analysis calibrated to ${selectedProduct.productName} (₹${selectedProduct.retailPriceINR}).`,
      evidenceId: selectedProduct.evidenceId,
      badge: "Workspace",
    },
    {
      id: "act-2",
      time: "45 mins ago",
      title: "Competitor Vulnerability Flagged",
      desc: "18% of Minimalist B5 Gel reviews cite occlusive sweat trapping in monsoon humidity.",
      evidenceId: "EVD-REV-CP001",
      badge: "Competitor Defect",
    },
    {
      id: "act-3",
      time: "2 hours ago",
      title: "Customer Sentiment Mapped",
      desc: "Arundhati S. (Mumbai) verified 10-second watery absorption during coastal commute.",
      evidenceId: "EVD-REV-DK001",
      badge: "Customer Love",
    },
    {
      id: "act-4",
      time: "3 hours ago",
      title: "High-Conviction Angle Mapped",
      desc: "'The Sweatless Monsoon Barrier Shield' mapped with 3 verified evidence citations.",
      evidenceId: "EVD-REV-DK002",
      badge: "Opportunity",
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
              <span>{metadata.datasetName}</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink-primary tracking-tight leading-tight">
              Market Intelligence that Creates Marketing
            </h1>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
              Welcome to KAIROS. Your research command center transforms audited retail reviews, competitor vulnerability data, and product claims into verifiable, high-converting marketing assets for Dot & Key.
            </p>
            <div className="pt-2 flex items-center gap-3 flex-wrap text-xs">
              <span className="font-medium text-ink-muted">Active Subject:</span>
              <span className="px-3 py-1 rounded-xl bg-app-subtle border border-terracotta/30 text-ink-primary font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-terracotta" />
                {selectedProduct.productName} (₹{selectedProduct.retailPriceINR})
              </span>
              <EvidenceBadge id={selectedProduct.evidenceId} />
            </div>
          </div>

          {/* Quick CTA to Studio */}
          <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3">
            <Link
              href="/marketing-studio"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-terracotta text-ink-inverted text-xs sm:text-sm font-semibold hover:bg-terracotta-hover transition-all shadow-clay-sm"
            >
              <PenTool className="w-4 h-4" />
              <span>Launch Marketing Studio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-app-subtle border border-line-subtle text-ink-primary text-xs sm:text-sm font-semibold hover:bg-app-card transition-all"
            >
              <Layers className="w-4 h-4 text-ink-muted" />
              <span>Browse Product Library</span>
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
            {metadata.totalReviewsAudited?.toLocaleString() || "4,820"}
          </div>
          <div className="text-[11px] text-ink-muted flex items-center gap-1">
            <span className="text-status-success font-semibold">100% Verified</span> from Nykaa & Amazon
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-app-card border border-line-subtle shadow-clay-sm space-y-2">
          <div className="flex items-center justify-between text-ink-muted">
            <span className="text-[11px] font-mono uppercase font-semibold">Dot & Key Catalogue</span>
            <Layers className="w-4 h-4 text-terracotta" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-ink-primary">
            {products.length} Products
          </div>
          <div className="text-[11px] text-ink-muted flex items-center gap-1">
            <span>Price range: ₹495 - ₹695</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-app-card border border-line-subtle shadow-clay-sm space-y-2">
          <div className="flex items-center justify-between text-ink-muted">
            <span className="text-[11px] font-mono uppercase font-semibold">Competitors Benchmarked</span>
            <Scale className="w-4 h-4 text-terracotta" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-ink-primary">
            {competitors.length} Brands
          </div>
          <div className="text-[11px] text-ink-muted">
            Minimalist, Plum, Derma Co, Foxtale, Aqualogica
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-app-card border border-line-subtle shadow-clay-sm space-y-2">
          <div className="flex items-center justify-between text-ink-muted">
            <span className="text-[11px] font-mono uppercase font-semibold">Sentiment Split</span>
            <ShieldCheck className="w-4 h-4 text-sage-dark" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-status-success">
            {insightsData.sentimentBreakdown.positivePercent}% Positive
          </div>
          <div className="text-[11px] text-ink-muted">
            18% Neutral • 8% Critical
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
              Five linked stages ensuring all marketing output is anchored in audited retail facts
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-status-success-bg text-status-success border border-sage/20 self-start sm:self-auto">
            5 of 5 Stages Ready
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {workflowSteps.map((ws, i) => (
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
                  <CheckCircle2 className="w-4 h-4 text-status-success" />
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

        {/* Recent Activity Feed (1 col on large) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-ink-primary">
              Recent Intelligence
            </h2>
            <span className="text-xs text-ink-muted">Audit Stream</span>
          </div>

          <div className="p-4 rounded-2xl bg-app-card border border-line-subtle shadow-clay-sm divide-y divide-line-subtle/50">
            {recentActivity.map((ra) => (
              <div key={ra.id} className="py-3 first:pt-0 last:pb-0 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-app-subtle text-ink-primary border border-line-subtle font-semibold">
                    {ra.badge}
                  </span>
                  <span className="text-[10px] font-mono text-ink-muted">
                    {ra.time}
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-ink-primary">
                  {ra.title}
                </h4>
                <p className="text-[11px] text-ink-muted leading-relaxed">
                  {ra.desc}
                </p>
                <div className="pt-0.5">
                  <EvidenceBadge id={ra.evidenceId} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
