"use client";

import React from "react";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import EvidenceDrawer from "@/components/EvidenceDrawer";
import HelpModal from "@/components/HelpModal";
import SettingsModal from "@/components/SettingsModal";
import KairosCopilot from "@/components/KairosCopilot";
import { useApp } from "@/components/AppContext";

export default function AppShell({ children }) {
  const { metadata } = useApp();

  return (
    <div className="min-h-screen bg-app-bg text-ink-primary flex antialiased">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Persistent Top Navigation Bar */}
        <TopNav />

        {/* Dynamic Page Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </main>

        {/* Editorial Studio Footer */}
        <footer className="border-t border-line-subtle bg-app-card/60 py-6 px-4 sm:px-6 lg:px-8 shrink-0">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-ink-muted">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-serif font-bold text-ink-primary text-sm">
                KAIROS
              </span>
              <span>•</span>
              <span>Market Intelligence that Creates Marketing</span>
              <span>•</span>
              <span className="font-mono text-[11px] text-terracotta">Dot & Key Skincare Intelligence</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-mono">
              <span>Data collected from public pages (dotandkey.com, Nykaa, Amazon) on 21 Nov 2026</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Persistent Global Modals and Drawers */}
      <EvidenceDrawer />
      <HelpModal />
      <SettingsModal />
      <KairosCopilot />
    </div>
  );
}
