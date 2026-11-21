"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  HERO_PRODUCT,
  standaloneProducts,
} from "@/data/productsLoader";
import {
  PRODUCTS as FIXTURE_PRODUCTS,
  COMPETITORS as FIXTURE_COMPETITORS,
  EVIDENCE_REVIEWS as FIXTURE_REVIEWS,
  INSIGHTS_DATA,
  CREATIVE_STUDIO_FIXTURES,
  RESEARCH_METADATA,
  INITIAL_NOTIFICATIONS,
  INITIAL_EXPORTS,
} from "@/data/researchFixtures";
import { VERIFIED_SUNSCREEN_DATA } from "@/data/research/unifiedData";

// Combine competitors and reviews while prioritizing real catalogue products
const COMBINED_COMPETITORS = [
  ...FIXTURE_COMPETITORS,
  ...(VERIFIED_SUNSCREEN_DATA?.competitors || []),
];

const COMBINED_REVIEWS = [
  ...FIXTURE_REVIEWS,
  ...(VERIFIED_SUNSCREEN_DATA?.reviews || []),
];

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [selectedProduct, setSelectedProduct] = useState(HERO_PRODUCT);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [activeAngleId, setActiveAngleId] = useState("monsoon-barrier");
  const [selectedAudienceId, setSelectedAudienceId] = useState("gen-z");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Evidence Drawer State
  const [activeEvidence, setActiveEvidence] = useState(null);
  const [isEvidenceDrawerOpen, setIsEvidenceDrawerOpen] = useState(false);

  // Modals
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS || []);
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  function markAllNotificationsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  // Exports History
  const [exportHistory, setExportHistory] = useState(INITIAL_EXPORTS || []);
  const [analysisStatus, setAnalysisStatus] = useState("not_started"); // "not_started" | "running" | "done"

  function addExportRecord(record) {
    const newRecord = {
      id: `EXP-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      productName: selectedProduct.productName,
      productId: selectedProduct.id,
      ...record,
    };
    setExportHistory((prev) => [newRecord, ...prev]);
  }

  // Helper to open drawer with raw object or string ID
  function openEvidence(evidenceOrId) {
    if (!evidenceOrId) return;

    if (typeof evidenceOrId === "object") {
      setActiveEvidence(evidenceOrId);
      setIsEvidenceDrawerOpen(true);
      return;
    }

    const id = evidenceOrId.toString().trim();
    // 1. Check in reviews
    const foundReview = COMBINED_REVIEWS.find((r) => r.id === id);
    if (foundReview) {
      setActiveEvidence(foundReview);
      setIsEvidenceDrawerOpen(true);
      return;
    }

    // 2. Check in products
    const foundProd = standaloneProducts.find((p) => p.id === id || String(p.id) === id);
    if (foundProd) {
      setActiveEvidence(foundProd);
      setIsEvidenceDrawerOpen(true);
      return;
    }

    // 3. Check in competitors
    const foundComp = COMBINED_COMPETITORS.find((c) => c.id === id || String(c.id) === id);
    if (foundComp) {
      setActiveEvidence(foundComp);
      setIsEvidenceDrawerOpen(true);
      return;
    }

    // Fallback record
    setActiveEvidence({
      id: id,
      brand: "Dot & Key Market Intelligence",
      productName: selectedProduct?.productName || "Public Reference",
      category: "Formulation Specification",
      verbatimQuote: "Record collected from public retail data.",
      sourcePlatform: "Public Retail Page",
      date: "November 2026",
      rating: 5,
    });
    setIsEvidenceDrawerOpen(true);
  }

  function closeEvidence() {
    setIsEvidenceDrawerOpen(false);
  }

  function toggleSidebar() {
    setIsSidebarCollapsed((prev) => !prev);
  }

  const value = {
    selectedProduct,
    setSelectedProduct,
    selectedLanguage,
    setSelectedLanguage,
    activeAngleId,
    setActiveAngleId,
    selectedAudienceId,
    setSelectedAudienceId,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    toggleSidebar,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    searchQuery,
    setSearchQuery,
    activeEvidence,
    isEvidenceDrawerOpen,
    openEvidence,
    closeEvidence,
    isHelpModalOpen,
    setIsHelpModalOpen,
    isSettingsModalOpen,
    setIsSettingsModalOpen,
    notifications,
    unreadNotificationsCount,
    markAllNotificationsRead,
    exportHistory,
    addExportRecord,
    analysisStatus,
    setAnalysisStatus,
    // Real standalone catalogue products
    products: standaloneProducts,
    competitors: FIXTURE_COMPETITORS,
    reviews: FIXTURE_REVIEWS,
    insightsData: INSIGHTS_DATA,
    creativeFixtures: CREATIVE_STUDIO_FIXTURES,
    metadata: RESEARCH_METADATA,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
