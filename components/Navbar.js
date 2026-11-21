"use client";

import React from "react";
import { Sparkles, Search, Database, Layers, BarChart3, PenTool, CheckCircle2 } from "lucide-react";

export default function Navbar({
  activeSection,
  setActiveSection,
  searchQuery,
  setSearchQuery,
  metadata,
}) {
  const navItems = [
    { id: "research", label: "1. Research", icon: Database },
    { id: "insights", label: "2. Insights", icon: BarChart3 },
    { id: "creative", label: "3. Creative Studio", icon: PenTool },
  ];

  return (
    <header className="sticky top-0 z-40 bg-app-card/90 backdrop-blur-md border-b border-line-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3.5">
          {/* Brand Identity */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-terracotta flex items-center justify-center text-ink-inverted shadow-clay-sm font-serif font-bold text-xl">
              K
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl sm:text-2xl text-ink-primary font-bold tracking-tight">
                  KAIROS
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-sand-light text-ink-primary border border-line-subtle font-mono font-medium hidden sm:inline-block">
                  Proof2Pitch AI
                </span>
              </div>
              <span className="text-[10px] text-ink-muted uppercase tracking-wider block font-medium">
                Dot & Key Intelligence Studio
              </span>
            </div>
          </div>

          {/* Search Input Filter */}
          <div className="hidden md:flex items-center relative w-72 lg:w-80">
            <Search className="w-4 h-4 text-ink-muted absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter reviews or ingredients..."
              className="w-full bg-app-subtle text-xs text-ink-primary placeholder-ink-muted pl-9 pr-3 py-2 rounded-lg border border-line-subtle focus:border-terracotta focus:ring-1 focus:ring-terracotta focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 text-xs text-ink-muted hover:text-ink-primary"
                title="Clear filter"
              >
                ×
              </button>
            )}
          </div>

          {/* Dataset Status Tag */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-status-success-bg border border-sage/30 text-xs text-status-success">
              <span className="w-2 h-2 rounded-full bg-sage-dark animate-pulse" />
              <span className="font-medium">
                {metadata?.totalReviewsAudited?.toLocaleString() || "4,820"} Reviews Ingested
              </span>
            </div>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-1 sm:gap-2 pb-2.5 overflow-x-auto no-scrollbar border-t border-line-subtle/50 pt-2.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center gap-2 px-3.5 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all shrink-0 focus-visible:ring-2 focus-visible:ring-terracotta focus:outline-none ${
                  isActive
                    ? "bg-terracotta text-ink-inverted shadow-clay-sm font-semibold"
                    : "text-ink-muted hover:text-ink-primary hover:bg-app-subtle"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-ink-inverted" : "text-ink-muted"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
