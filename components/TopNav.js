"use client";

import React, { useState, useRef, useEffect } from "react";
import { useApp } from "@/components/AppContext";
import {
  Menu,
  ChevronDown,
  Globe,
  Check,
  Package,
} from "lucide-react";

export default function TopNav() {
  const {
    selectedProduct,
    setSelectedProduct,
    selectedLanguage,
    setSelectedLanguage,
    products,
    setIsMobileSidebarOpen,
    metadata,
  } = useApp();

  const [isProductMenuOpen, setIsProductMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const productRef = useRef(null);
  const langRef = useRef(null);

  const languages = ["English", "Hindi", "Bengali", "Hinglish"];

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (productRef.current && !productRef.current.contains(e.target)) {
        setIsProductMenuOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target)) {
        setIsLangMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-20 bg-app-card/95 backdrop-blur-md border-b border-line-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Left: Mobile Toggle + Product Selector */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl text-ink-muted hover:text-ink-primary hover:bg-app-subtle border border-line-subtle"
              title="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Current Product Selector Dropdown */}
            <div className="relative" ref={productRef}>
              <button
                type="button"
                onClick={() => setIsProductMenuOpen((prev) => !prev)}
                className="flex items-center gap-2.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-app-subtle hover:bg-app-card border border-line-subtle hover:border-terracotta/40 transition-all text-left shadow-clay-sm group"
                title="Change active product"
              >
                <div className="w-7 h-7 rounded-lg bg-terracotta/10 text-terracotta flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-terracotta group-hover:text-ink-inverted transition-colors">
                  <Package className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 max-w-[140px] sm:max-w-[220px] lg:max-w-[280px]">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono uppercase font-bold text-terracotta">
                      {selectedProduct?.brand || "Dot & Key"}
                    </span>
                    <span className="text-[10px] font-mono text-ink-muted hidden sm:inline">
                      [{selectedProduct?.evidenceId}]
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-ink-primary truncate leading-tight">
                    {selectedProduct?.productName || "Select Product"}
                  </div>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-ink-muted shrink-0 transition-transform ${
                    isProductMenuOpen ? "rotate-180 text-terracotta" : ""
                  }`}
                />
              </button>

              {/* Product Selector Dropdown Menu */}
              {isProductMenuOpen && (
                <div className="absolute left-0 mt-2 w-80 sm:w-96 rounded-2xl bg-app-card border border-line-subtle shadow-clay-lg py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-4 py-2 border-b border-line-subtle/70 flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase font-bold text-ink-muted">
                      Select Flagship Product
                    </span>
                    <span className="text-[11px] font-mono text-terracotta">
                      {products.length} Products
                    </span>
                  </div>
                  <div className="max-h-80 overflow-y-auto py-1 divide-y divide-line-subtle/40 custom-scrollbar">
                    {products.map((p) => {
                      const isSelected = selectedProduct?.id === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setSelectedProduct(p);
                            setIsProductMenuOpen(false);
                          }}
                          className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors ${
                            isSelected
                              ? "bg-terracotta/10 text-ink-primary"
                              : "hover:bg-app-subtle text-ink-muted hover:text-ink-primary"
                          }`}
                        >
                          <div
                            className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold mt-0.5 ${
                              isSelected
                                ? "bg-terracotta text-ink-inverted"
                                : "bg-app-subtle text-ink-muted border border-line-subtle"
                            }`}
                          >
                            {isSelected ? <Check className="w-3.5 h-3.5" /> : "•"}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-bold text-ink-primary truncate">
                                {p.productName}
                              </span>
                              <span className="text-[11px] font-semibold text-terracotta shrink-0">
                                ₹{p.retailPriceINR}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-ink-muted">
                              <span>{p.category}</span>
                              <span>•</span>
                              <span>★ {p.rating} ({p.reviewCount?.toLocaleString()})</span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Language Selector, Notifications, User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Public Intelligence Status Pill (Desktop) */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-status-success-bg border border-sage/20 text-xs text-status-success font-medium">
              <span className="w-2 h-2 rounded-full bg-sage-dark animate-pulse" />
              <span>Public Intelligence</span>
            </div>

            {/* Language Selector */}
            <div className="relative" ref={langRef}>
              <button
                type="button"
                onClick={() => setIsLangMenuOpen((prev) => !prev)}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-app-subtle hover:bg-app-card border border-line-subtle text-xs font-medium text-ink-primary transition-all shadow-clay-sm"
                title="Select language"
              >
                <Globe className="w-3.5 h-3.5 text-terracotta" />
                <span className="hidden sm:inline">{selectedLanguage}</span>
                <span className="sm:hidden">{selectedLanguage.slice(0, 2)}</span>
                <ChevronDown className="w-3.5 h-3.5 text-ink-muted" />
              </button>

              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-app-card border border-line-subtle shadow-clay-lg py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-3 py-1.5 border-b border-line-subtle text-[10px] font-mono font-bold text-ink-muted uppercase">
                    Copy Language
                  </div>
                  {languages.map((lang) => {
                    const isSelected = selectedLanguage === lang;
                    return (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => {
                          setSelectedLanguage(lang);
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium transition-colors ${
                          isSelected
                            ? "bg-terracotta/10 text-terracotta font-semibold"
                            : "hover:bg-app-subtle text-ink-primary"
                        }`}
                      >
                        <span>{lang}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-terracotta" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Demo mode tag */}
            <div className="px-3 py-1 rounded-xl bg-app-subtle border border-line-subtle text-xs font-mono font-semibold text-ink-muted tracking-tight">
              Demo mode
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
